package com.example.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.user.entity.User;

import java.util.Optional;

public interface UserRepositoty extends JpaRepository<User, String> {

    Optional<User> findByEmail (String email);
}
