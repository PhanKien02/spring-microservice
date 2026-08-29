package com.example.gateway.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.web.server.SecurityWebFilterChain;

import com.example.gateway.security.jwt.JwtAuthenticationFilter;
import com.example.gateway.security.jwt.JwtUtil;

@Configuration
public class SecurityConfig {

        @Bean
        public SecurityWebFilterChain securityWebFilterChain(
                        ServerHttpSecurity http,
                        JwtUtil jwtUtil) {
                return http
                                .csrf(csrf -> csrf.disable())
                                .httpBasic(basic -> basic.disable())
                                .formLogin(login -> login.disable())
                                .logout(logout -> logout.disable())
                                .addFilterAt(new JwtAuthenticationFilter(jwtUtil),
                                                SecurityWebFiltersOrder.AUTHENTICATION)
                                .authorizeExchange(exchange -> exchange
                                                .pathMatchers("/api/auth/**").permitAll()
                                                .pathMatchers("/actuator/health", "/actuator/info").permitAll()
                                                .anyExchange().authenticated())
                                .build();
        }
}
