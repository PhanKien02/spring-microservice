package com.example.user.service;

import com.example.user.dto.CreateUserReq;
import com.example.user.dto.LoginReq;
import com.example.user.dto.LoginRes;

public interface AuthenticationService {

        public LoginRes login(LoginReq loginReq);

        public LoginRes register(CreateUserReq req);
}
