package org.example.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;


@RequiredArgsConstructor
@Configuration
public class WebConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
//        TODO: specific role-creds for monitoring
//        TODO: actuator
//        TODO: Default - require creds
        return httpSecurity
                .authorizeHttpRequests((auth) -> auth.anyRequest().permitAll())
                .csrf(AbstractHttpConfigurer::disable)
                .build();
    }
}
