package com.example.user.service;

import java.util.List;
import com.example.user.dto.UpdateUserReq;
import com.example.user.dto.UserRes;

public interface UserService {

    public UserRes getUserById(String id);

    public List<UserRes> getAllUser();

    public UserRes updateUser(String id, UpdateUserReq req);

    public boolean deleteUser(String id);
}
