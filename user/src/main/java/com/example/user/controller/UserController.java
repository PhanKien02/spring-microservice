package com.example.user.controller;

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
    public UserRes getUser(@PathVariable String id) {
        return this.userService.getUserById(id);
    }
}
