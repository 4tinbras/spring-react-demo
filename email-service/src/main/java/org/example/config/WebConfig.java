package org.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;


@EnableWebSecurity
@Configuration
public class WebConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
//        TODO: specific role-creds for monitoring
//        TODO: Default - require creds
        return httpSecurity
                .authorizeHttpRequests((auth) -> auth
                                .requestMatchers("/actuator/**").anonymous()
                                .anyRequest()
//                                .anonymous()
                                //stonewall any requests that do not go to actuator
                                .authenticated()
                )
//                .oauth2ResourceServer(oauth2 -> oauth2.jwt(
//                        Customizer.withDefaults()
//                ))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .build();
    }
}
