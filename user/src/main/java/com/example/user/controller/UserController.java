package com.example.user.controller;
import org.springframework.web.bind.annotation.*;
import com.example.user.dto.CreateUserReq;
import com.example.user.dto.UserRes;
import com.example.user.service.UserService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    public UserRes createUser(@RequestBody CreateUserReq req) {
       return this.userService.createUser(req);
    }
    @GetMapping
    public String getUser() {
       return "hello";
    }
}
