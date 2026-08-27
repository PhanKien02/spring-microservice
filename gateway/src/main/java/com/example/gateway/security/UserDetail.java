package com.example.gateway.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class UserDetail implements UserDetailsService {

        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                // TODO Auto-generated method stub
                throw new UnsupportedOperationException("Unimplemented method 'loadUserByUsername'");
        }
        
}
