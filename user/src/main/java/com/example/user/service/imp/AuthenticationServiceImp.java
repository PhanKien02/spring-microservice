package com.example.user.service.imp;

import com.example.user.exeption.AppException;
import com.example.user.jwt.JwtProvider;

import java.util.Optional;

import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.user.dto.CreateUserReq;
import com.example.user.dto.LoginReq;
import com.example.user.dto.LoginRes;
import com.example.user.dto.UserRes;
import com.example.user.entity.User;
import com.example.user.repository.UserRepositoty;
import com.example.user.service.AuthenticationService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class AuthenticationServiceImp implements AuthenticationService {

        private final UserRepositoty userRepositoty;
        private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        private final JwtProvider jwtProvider;

        public AuthenticationServiceImp(UserRepositoty userRepositoty, JwtProvider jwtProvider) {
                this.userRepositoty = userRepositoty;
                this.jwtProvider = jwtProvider;
        }

        @Override
        public LoginRes login(LoginReq loginReq) {
                Optional<User> user = this.userRepositoty.findByEmail(loginReq.getUserName());
                if (user.isEmpty()) {
                        throw new AppException(HttpStatus.NOT_FOUND, "User or password Incorrect ");
                }
                // So khớp mật khẩu nhập vào với mật khẩu đã băm DB
                if (!passwordEncoder.matches(loginReq.getPassword(), user.get().getPassword())) {
                        throw new AppException(HttpStatus.UNAUTHORIZED, "User or password Incorrect ");
                }
                UserRes userRes = UserRes.builder()
                                .id(user.get().getId())
                                .name(user.get().getFullName())
                                .email(user.get().getEmail())
                                .build();
                // Tạo token JWT
                String token = jwtProvider.generateToken(user.get().getId(), user.get().getFullName());
                return LoginRes.builder()
                                .user(userRes)
                                .token(token)
                                .build();
        }

        public LoginRes register(CreateUserReq req) {
                Optional<User> hasEmail = this.userRepositoty.findByEmail(req.getEmail());
                if (hasEmail.isPresent()) {
                        throw new AppException(HttpStatus.BAD_REQUEST, "Email exists");
                }
                User user = User.builder()
                                .email(req.getEmail())
                                .password(this.passwordEncoder.encode(req.getPassword()))
                                .fullName(req.getName())
                                .build();
                User saveUser = this.userRepositoty.save(user);
                UserRes userRes = UserRes.builder()
                                .id(saveUser.getId())
                                .name(saveUser.getFullName())
                                .email(saveUser.getEmail())
                                .build();

                return LoginRes.builder()
                                .user(userRes)
                                .token(jwtProvider.generateToken(saveUser.getId(), saveUser.getFullName()))
                                .build();
        }

}