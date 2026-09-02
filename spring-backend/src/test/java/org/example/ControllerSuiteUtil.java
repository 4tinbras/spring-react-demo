package org.example;

import com.github.tomakehurst.wiremock.junit5.WireMockExtension;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import java.time.Instant;
import java.util.Date;

public class ControllerSuiteUtil {

    protected static RSAKey validRsaKey;


    protected String getSignedJwt(WireMockExtension wireMockServer) throws Exception {
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
}
