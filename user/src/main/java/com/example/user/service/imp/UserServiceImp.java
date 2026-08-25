package com.example.user.service.imp;

import java.util.List;
import java.util.Optional;

import com.example.user.entity.User;
import com.example.user.repository.UserRepositoty;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.user.dto.CreateUserReq;
import com.example.user.dto.UpdateUserReq;
import com.example.user.dto.UserRes;
import com.example.user.service.UserService;
import org.springframework.web.client.HttpClientErrorException;

@Slf4j
@Service
public class UserServiceImp implements UserService {

    private final UserRepositoty userRepositoty;

    public UserServiceImp(UserRepositoty userRepositoty) {
        this.userRepositoty = userRepositoty;
    }

    @Override
    public UserRes createUser(CreateUserReq req) {
        Optional<User> hasEmail = this.userRepositoty.findByEmail(req.getEmail());
        if(hasEmail.isPresent()) throw new HttpClientErrorException(HttpStatus.BAD_REQUEST,"Email exits");
        User user = User.builder().email(req.getEmail())
                .password(req.getPassword())
                .name(req.getName())
                .build();
        User saveUser=  this.userRepositoty.save(user);
        return UserRes.builder()
                .email(saveUser.getEmail())
                .name(saveUser.getName())
                .id(saveUser.getId())
                .build();
    }

    @Override
    public UserRes getUserById(String id) {
      User user = this.userRepositoty.findById(id).orElseThrow(() -> new HttpClientErrorException(HttpStatus.NOT_FOUND,"User not found"));
      return UserRes.builder()
              .email(user.getEmail())
              .name(user.getName())
              .id(user.getId())
              .build();
    }

    @Override
    public List<UserRes> getAllUser() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAllUser'");
    }

    @Override
    public UserRes updateUser(String id, UpdateUserReq req) {
        User user = this.userRepositoty.findById(id).orElseThrow(() -> new HttpClientErrorException(HttpStatus.NOT_FOUND,"User not found"));
        user.setEmail(req.getEmail());
        user.setName(req.getName());
        user.setPassword(req.getPassword());
        User saveUser=  this.userRepositoty.save(user);
        return UserRes.builder()
                .email(saveUser.getEmail())
                .name(saveUser.getName())
                .id(saveUser.getId())
                .build();
    }

    @Override
    public boolean deleteUser(String id) {
        User user = this.userRepositoty.findById(id).orElseThrow(() -> new HttpClientErrorException(HttpStatus.NOT_FOUND,"User not found"));
        user.setActive(false);  
        this.userRepositoty.save(user);
        return true;
    }

}
