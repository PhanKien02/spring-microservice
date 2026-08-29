package com.example.user.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.validation.annotation.Validated;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Validated
public class CreateUserReq {
    @NotEmpty
    @NotEmpty
    private String name;

    @NotEmpty
    @NotEmpty
    private String email;

    @NotEmpty
    @NotEmpty
    private String password;
}
