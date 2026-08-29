package com.example.user.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtProvider {
        private final SecretKey secretKey;
        private final long expiration;

        public JwtProvider(
                        @Value("${jwt.secret}") String secret,
                        @Value("${jwt.expiration}") long expiration) {
                this.secretKey = Keys.hmacShaKeyFor(
                                secret.getBytes(StandardCharsets.UTF_8));
                this.expiration = expiration;
        }

        public String generateToken(
                        String userId,
                        String username) {

                Date now = new Date();
                Date expiry = new Date(
                                now.getTime() + expiration);

                return Jwts.builder()
                                .subject(userId)
                                .claim("username", username)
                                .issuedAt(now)
                                .expiration(expiry)
                                .signWith(secretKey)
                                .compact();
        }

        public Claims validateAndGetClaims(String token) {

                return Jwts.parser()
                                .verifyWith(secretKey)
                                .build()
                                .parseSignedClaims(token)
                                .getPayload();
        }
}
