package com.example.user.service;

import java.util.List;

import com.example.user.dto.CreateUserReq;
import com.example.user.dto.UserRes;

public interface UserService {
    public UserRes createUser(CreateUserReq req);

    public UserRes getUserById(String id);

    public List<UserRes> getAllUser();

    public UserRes updateUser(String id, CreateUserReq req);

    public UserRes deleteUser(String id);
}
