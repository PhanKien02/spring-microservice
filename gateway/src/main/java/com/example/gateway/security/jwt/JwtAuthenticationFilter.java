package com.example.gateway.security.jwt;

import java.util.Collection;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;

import io.jsonwebtoken.Claims;
import reactor.core.publisher.Mono;

/**
 * Validates bearer tokens before a request is forwarded by the gateway.
 */
public class JwtAuthenticationFilter implements WebFilter {

    private static final String BEARER_PREFIX = "Bearer ";
    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @SuppressWarnings("null")
    @Override
    public @NonNull Mono<Void> filter(@NonNull ServerWebExchange exchange, @NonNull WebFilterChain chain) {
        if (isPublicPath(exchange)) {
            return chain.filter(exchange);
        }

        String authorization = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authorization == null || !authorization.startsWith(BEARER_PREFIX)
                || authorization.length() == BEARER_PREFIX.length()) {
            return unauthorized(exchange);
        }

        try {
            Claims claims = jwtUtil.validateAndGetClaims(authorization.substring(BEARER_PREFIX.length()));
            String userId = claims.getSubject();
            String username = claims.get("username", String.class);
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    username != null ? username : userId,
                    null,
                    authorities(claims));

            ServerHttpRequest request = exchange.getRequest().mutate()
                    // Do not allow a caller to spoof identity headers.
                    .headers(headers -> {
                        headers.remove("X-User-Id");
                        headers.remove("X-User-Name");
                        headers.set("X-User-Id", userId);
                        if (username != null) {
                            headers.set("X-User-Name", username);
                        }
                    })
                    .build();

            return chain.filter(exchange.mutate().request(request).build())
                    .contextWrite(ReactiveSecurityContextHolder.withAuthentication(authentication));
        } catch (RuntimeException exception) {
            return unauthorized(exchange);
        }
    }

    private boolean isPublicPath(ServerWebExchange exchange) {
        String path = exchange.getRequest().getPath().value();
        return path.startsWith("/api/auth/")
                || path.equals("/api/auth")
                || path.equals("/actuator/health")
                || path.equals("/actuator/info");
    }

    private Collection<? extends GrantedAuthority> authorities(Claims claims) {
        String role = claims.get("role", String.class);
        return role == null || role.isBlank()
                ? List.of()
                : List.of(new SimpleGrantedAuthority(role.startsWith("ROLE_") ? role : "ROLE_" + role));
    }

    private @NonNull Mono<Void> unauthorized(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }
}
