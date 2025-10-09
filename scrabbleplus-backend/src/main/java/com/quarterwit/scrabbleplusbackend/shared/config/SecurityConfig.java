package com.quarterwit.scrabbleplusbackend.shared.security;
import org.springframework.context.annotation.*; import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/v3/api-docs/**","/swagger-ui/**","/swagger-ui.html","/h2-console/**").permitAll()
                        .anyRequest().permitAll())
                .headers(h -> h.frameOptions(f -> f.disable())); // allow H2 console
        return http.build();
    }
}
