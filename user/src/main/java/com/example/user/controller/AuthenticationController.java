package com.example.user.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.user.dto.CreateUserReq;
import com.example.user.dto.LoginReq;
import com.example.user.dto.LoginRes;
import com.example.user.http.ApiResult;
import com.example.user.http.ResponseData;
import com.example.user.service.AuthenticationService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {
        private final AuthenticationService authenticationService;

        @PostMapping("/login")
        public ResponseEntity<ResponseData> login(@Valid @RequestBody LoginReq req) {
                LoginRes result = this.authenticationService.login(req);
                ResponseData responseData = new ResponseData();
                responseData.addData("LoginRes", result);
                return ApiResult.success(responseData);
        }

        @PostMapping("/register")
        public ResponseEntity<ResponseData> register(@Valid @RequestBody CreateUserReq req) {
                LoginRes result = this.authenticationService.register(req);
                ResponseData responseData = new ResponseData();
                responseData.addData("LoginRes", result);
                return ApiResult.success(responseData);
        }
}
