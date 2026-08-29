package com.example.user.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginRes {
        private UserRes user;
        private String token;
}
