package org.example.contact;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.tomakehurst.wiremock.client.WireMock;
import com.github.tomakehurst.wiremock.junit5.WireMockExtension;
import com.nimbusds.jose.Algorithm;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.jwk.KeyUse;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.gen.RSAKeyGenerator;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.example.Main;
import org.example.persistence.ContactDetails;
import org.example.persistence.ContactRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.Instant;
import java.util.Collections;
import java.util.Date;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;
import static java.lang.String.format;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK, classes = Main.class)
@AutoConfigureMockMvc
@DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
class ContactControllerTest {

    @RegisterExtension
    final static WireMockExtension wireMockServer = WireMockExtension.newInstance()
            .options(wireMockConfig().dynamicPort())
            .build();
    private static final String KEY_ID = "12345678901234567890";

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ContactRepository contactRepository;

    @MockitoBean
    private ContactService contactService;

    private ObjectMapper objectMapper;

    private ContactDetails validRecord = new ContactDetails(0L, "Tom", "Smith", "ts@example.com", "079678234");
    private static RSAKey validRsaKey;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.security.oauth2.resourceserver.jwt.jwk-set-uri", wireMockServer::baseUrl);
        registry.add("spring.security.oauth2.resourceserver.jwt.issuer-uri", wireMockServer::baseUrl);
    }

    @BeforeAll
    public static void beforeAll() throws JOSEException {


        validRsaKey = new RSAKeyGenerator(2048)
                .keyUse(KeyUse.SIGNATURE)
                .algorithm(new Algorithm("RS256"))
                .keyID(KEY_ID)
                .generate();
    }

    @BeforeEach
    public void beforeEach() {
        RSAKey rsaPublicJWK = validRsaKey.toPublicJWK();
        String jwkResponse = format("{\"keys\": [%s]}", rsaPublicJWK.toJSONString());

        wireMockServer.stubFor(WireMock.get("/").willReturn(
                aResponse()
                        .withHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                        .withBody(jwkResponse)));

    }

    @Test
    void whenGetContacts_thenReturnValidSetOfRecords_andReturn200() throws Exception {
        //given
        when(contactRepository.findAll()).thenReturn(Collections.EMPTY_LIST);

//        when
        mockMvc.perform(
                        get("/contacts")
                                .header("Authorization", format("Bearer %s", getSignedJwt()))
                )
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("[]")));
    }

    @Test
    void whenPostValidContact_thenReturnValidSetOfRecords_andReturn200() throws Exception {
        //given
        objectMapper = new ObjectMapper();
        ContactDetails requestBody = validRecord;

        when(contactService.save(any())).thenReturn(requestBody);

        MvcResult result = mockMvc.perform(post("/contact")
                        .header("Authorization", format("Bearer %s", getSignedJwt()))
                        .content(objectMapper.writeValueAsBytes(requestBody))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isCreated())
                .andReturn();

        ContactDetails responseBody = objectMapper.readValue(result.getResponse().getContentAsString(), ContactDetails.class);

        //UUID is generated by app
        assertThat(requestBody).usingRecursiveComparison().ignoringFields("uuid").isEqualTo(responseBody);
    }

    @Test
    void whenPostEmptyName_thenReturn400() throws Exception {
        //given
        objectMapper = new ObjectMapper();
        ContactDetails requestBody = new ContactDetails(0L, null, "Smith", "ts@example.com", "079678234");

        MvcResult result = mockMvc.perform(post("/contact")
                        .header("Authorization", format("Bearer %s", getSignedJwt()))
                        .content(objectMapper.writeValueAsBytes(requestBody))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andReturn();
    }

    @Test
    void whenPostInvalidEmail_thenReturn400() throws Exception {
        //given
        objectMapper = new ObjectMapper();
        ContactDetails requestBody = new ContactDetails(0L, "Tom", "Smith", "tsexample.com", "079678234");

        MvcResult result = mockMvc.perform(post("/contact")
                        .header("Authorization", format("Bearer %s", getSignedJwt()))
                        .content(objectMapper.writeValueAsBytes(requestBody))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andReturn();
    }

    @Test
    void whenPostInvalidPhoneNo_thenReturn400() throws Exception {
        //given
        objectMapper = new ObjectMapper();
        ContactDetails requestBody = new ContactDetails(0L, "Tom", "Smith", "tsexample.com", "NaN");

        MvcResult result = mockMvc.perform(post("/contact")
                        .header("Authorization", format("Bearer %s", getSignedJwt()))
                        .content(objectMapper.writeValueAsBytes(requestBody))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andReturn();
    }

    @Test
    void whenPostSameMailTwiceForSameClient_thenReturn201() throws Exception {
        //given
        objectMapper = new ObjectMapper();
        ContactDetails requestBody = validRecord;

        when(contactService.findByEmail(any())).thenReturn(null, validRecord);
        when(contactService.save(any())).thenReturn(requestBody);

        MvcResult result = mockMvc.perform(post("/contact")
                        .header("Authorization", format("Bearer %s", getSignedJwt()))
                        .content(objectMapper.writeValueAsBytes(requestBody))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isCreated())
                .andReturn();

        ContactDetails responseBody = objectMapper.readValue(result.getResponse().getContentAsString(), ContactDetails.class);

        //UUID is generated by app
        assertThat(requestBody).usingRecursiveComparison().ignoringFields("uuid").isEqualTo(responseBody);

        MvcResult resultDuplicate = mockMvc.perform(post("/contact")
                        .header("Authorization", format("Bearer %s", getSignedJwt()))
                        .content(objectMapper.writeValueAsBytes(requestBody))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isCreated())
                .andReturn();
    }

    @Test
    void whenPostSameMailTwiceForDifferentClient_thenReturn422() throws Exception {
        //given
        objectMapper = new ObjectMapper();
        ContactDetails requestBody = validRecord;
        ContactDetails secondAccBody = new ContactDetails(99L, "Different", "Usern", "ts@example.com", "074978234");

        when(contactService.findByEmail(any())).thenReturn(null, validRecord);
        when(contactService.save(any())).thenReturn(requestBody);

        MvcResult result = mockMvc.perform(post("/contact")
                        .header("Authorization", format("Bearer %s", getSignedJwt()))
                        .content(objectMapper.writeValueAsBytes(requestBody))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isCreated())
                .andReturn();

        ContactDetails responseBody = objectMapper.readValue(result.getResponse().getContentAsString(), ContactDetails.class);

        //UUID is generated by app
        assertThat(requestBody).usingRecursiveComparison().ignoringFields("uuid").isEqualTo(responseBody);

        MvcResult resultDuplicate = mockMvc.perform(post("/contact")
                        .header("Authorization", format("Bearer %s", getSignedJwt()))
                        .content(objectMapper.writeValueAsBytes(secondAccBody))
                        .contentType(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isUnprocessableEntity())
                .andReturn();
    }

    @Test
    void whenDelete_thenObjectDeleted_andReturn204() throws Exception {
        //when
        objectMapper = new ObjectMapper();
        doNothing().when(contactService).deleteById("0");

        MvcResult result = mockMvc.perform(delete("/contact/0")
                        .header("Authorization", format("Bearer %s", getSignedJwt()))
                        .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isNoContent())
                .andReturn();

        verify(contactService).deleteById("0");
    }

    @Test
    void whenDeleteByInvalidId_thenReturn400() throws Exception {
        //when
        objectMapper = new ObjectMapper();
        doNothing().when(contactService).deleteById("0");

        MvcResult result = mockMvc.perform(delete("/contact/ ")
                        .header("Authorization", format("Bearer %s", getSignedJwt()))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andReturn();

        verify(contactService, never()).deleteById("0");
    }

    private String getSignedJwt() throws Exception {
        final RSASSASigner validSigner = new RSASSASigner(validRsaKey);

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .issueTime(Date.from(Instant.now()))
                .expirationTime(new Date(new Date().getTime() + 60 * 1000))
                .claim("scope", "email")
                .claim("aud", "resourceServer")
                .issuer(wireMockServer.baseUrl())
                .build();
        SignedJWT signedJWT = new SignedJWT(new JWSHeader.Builder(JWSAlgorithm.RS256)
                .keyID(validRsaKey.getKeyID()).build(), claimsSet);
        signedJWT.sign(validSigner);
        return signedJWT.serialize();
    }

    @Configuration
    public class Config {
        @Primary
        @Bean
        public JwtDecoder jwtDecoder() {
            return NimbusJwtDecoder.withJwkSetUri(wireMockServer.baseUrl()).build();
        }
    }
}