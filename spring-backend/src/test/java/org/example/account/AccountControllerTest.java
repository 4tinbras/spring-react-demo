package org.example.account;

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
import org.example.persistence.Account;
import org.example.persistence.AccountRepository;
import org.example.persistence.ContactDetails;
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
import java.util.List;
import java.util.Optional;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig;
import static java.lang.String.format;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK, classes = Main.class)
@AutoConfigureMockMvc
@DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
class AccountControllerTest {

    @RegisterExtension
    final static WireMockExtension wireMockServer = WireMockExtension.newInstance()
            .options(wireMockConfig().dynamicPort())
            .build();
    private static final String KEY_ID = "12345678901234567890";
    private static RSAKey validRsaKey;
    private final Account validAccount = new Account(0L, "Tom", "Smith",
            List.of(new ContactDetails(0L, null, "Tom", "Smith", "ts@example.com", "079678234")),
            Account.AccountType.END_USER, Account.AccountState.OK);
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private AccountRepository accountRepository;
    @MockitoBean
    private AccountService accountService;

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
    void givenGetAll_returnRecordAnd200() throws Exception {
        //given
        when(accountService.findAll()).thenReturn(Collections.EMPTY_LIST);

//        when
        mockMvc.perform(
                        get("/accounts")
                                .header("Authorization", format("Bearer %s", getSignedJwt()))
                )
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("[]")));
    }

    @Test
    void givenGetValidAccountId_returnRecordAnd200() throws Exception {
        //given
        when(accountService.findByUuid(eq("0"))).thenReturn(Optional.of(validAccount));

//        when
        mockMvc.perform(
                        get("/account/0")
                                .header("Authorization", format("Bearer %s", getSignedJwt()))
                )
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Tom")));
    }

    @Test
    void givenPostValidAccount_returnRecordAnd201() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();

        //given
        when(accountService.save(any())).thenReturn(validAccount);

//        when
        mockMvc.perform(
                        post("/account")
                                .header("Authorization", format("Bearer %s", getSignedJwt()))
                                .content(objectMapper.writeValueAsBytes(validAccount))
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(content().string(containsString("Tom")));
    }

    @Test
    void givenDeleteValidAccountId_returnRecordAnd200() throws Exception {
        //given

//        when
        mockMvc.perform(
                        delete("/account/0")
                                .header("Authorization", format("Bearer %s", getSignedJwt()))
                )
                .andDo(print())
                .andExpect(status().isNoContent());

        verify(accountService, times(1)).deleteById(eq("0"));
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