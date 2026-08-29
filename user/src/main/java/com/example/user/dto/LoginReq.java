package com.example.user.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LoginReq {
        @NotNull
        @NotEmpty
        private String userName;

        @NotNull
        @NotEmpty
        private String password;
}
