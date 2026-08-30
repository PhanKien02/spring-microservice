package com.example.user.controller;

import com.example.user.http.ApiResult;
import com.example.user.http.ResponseData;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.user.dto.UserRes;
import com.example.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<ResponseData> getUser(@PathVariable String id) {

        UserRes result = this.userService.getUserById(id);
        ResponseData data = new ResponseData();
        data.addData("user",result);
        return ApiResult.success(data);
    }
}
