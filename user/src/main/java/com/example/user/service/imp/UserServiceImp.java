package com.example.user.service.imp;

import java.util.List;
import java.util.Optional;

import com.example.user.entity.User;
import com.example.user.repository.UserRepositoty;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.user.dto.CreateUserReq;
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
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getUserById'");
    }

    @Override
    public List<UserRes> getAllUser() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAllUser'");
    }

    @Override
    public UserRes updateUser(String id, CreateUserReq req) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateUser'");
    }

    @Override
    public UserRes deleteUser(String id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteUser'");
    }

}
