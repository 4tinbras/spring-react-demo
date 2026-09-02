package org.example.relationship;

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
import org.example.persistence.Relationship;
import org.example.persistence.RelationshipRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
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

import java.time.Instant;
import java.util.Collections;
import java.util.Date;
import java.util.Optional;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;
import static java.lang.String.format;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK, classes = Main.class)
@AutoConfigureMockMvc
@DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
class RelationshipControllerTest {

    @RegisterExtension
    final static WireMockExtension wireMockServer = WireMockExtension.newInstance()
            .options(wireMockConfig().dynamicPort())
            .build();
    private static final String KEY_ID = "12345678901234567890";
    private static RSAKey validRsaKey;

    private final ContactDetails firstValidContact = new ContactDetails(1L, null, "Different", "Usern", "ts@example.com", "074978234");
    private final ContactDetails secondValidContact = new ContactDetails(2L, null, "Different", "Usern", "ts@example.com", "074978234");
    private final Relationship validRelationship = new Relationship(1L, firstValidContact, secondValidContact, Relationship.RelationshipType.FRIENDS);
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private RelationshipRepository relationshipRepository;
    @MockitoBean
    private RelationshipService relationshipService;
    private ObjectMapper objectMapper = new ObjectMapper();

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
    void whenGetAllRelationships_thenReturnValidSetOfRecords_andReturn200() throws Exception {
        //given
        when(relationshipService.findAll()).thenReturn(Collections.EMPTY_LIST);

//        when
        mockMvc.perform(
                        get("/relationships")
                                .header("Authorization", format("Bearer %s", getSignedJwt()))
                )
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("[]")));
    }

    @Test
    void whenGetRelationshipByContactId_thenReturnValidSetOfRecords_andReturn200() throws Exception {
        //given
        when(relationshipService.findByContactId(eq("1"))).thenReturn(Collections.EMPTY_LIST);

//        when
        mockMvc.perform(
                        get("/relationships?id=1")
                                .header("Authorization", format("Bearer %s", getSignedJwt()))
                )
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("[]")));
    }

    @Test
    void whenGetRelationshipByContactIds_thenReturnValidSetOfRecords_andReturn200() throws Exception {
        //given
        when(relationshipService.findByContactId(eq("1"))).thenReturn(Collections.EMPTY_LIST);
        when(relationshipService.findByContactPair(eq("1"), eq("2"))).thenReturn(Collections.EMPTY_LIST);

//        when
        mockMvc.perform(
                        get("/relationships?id=1&secondId=2")
                                .header("Authorization", format("Bearer %s", getSignedJwt()))
                )
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("[]")));
    }

    @Test
    void whenGetRelationshipById_thenReturnValidRecord_andReturn200() throws Exception {
        //given
        when(relationshipService.findByUuid(eq("1"))).thenReturn(Optional.of(validRelationship));

//        when
        mockMvc.perform(
                        get("/relationship/1")
                                .header("Authorization", format("Bearer %s", getSignedJwt()))
                )
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("FRIENDS")));
    }

    @Test
    void whenPostRelationship_thenReturnNewRecord_andReturn201() throws Exception {
        //given
        when(relationshipService.isRelationshipValid(any())).thenReturn(true);
        when(relationshipService.save(any())).thenReturn(validRelationship);

//        when
        mockMvc.perform(
                        post("/relationship")
                                .header("Authorization", format("Bearer %s", getSignedJwt()))
                                .content(objectMapper.writeValueAsString(validRelationship))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(content().string(containsString("FRIENDS")));
    }


    @Test
    void whenDeleteRelationship_thenDelete_andReturn204() throws Exception {
        mockMvc.perform(
                        delete("/relationship/1")
                                .header("Authorization", format("Bearer %s", getSignedJwt()))
                )
                .andDo(print())
                .andExpect(status().isNoContent());

        verify(relationshipService).deleteById("1");
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