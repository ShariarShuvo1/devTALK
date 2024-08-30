package com.amakakeru.devtalk.service;

import com.amakakeru.devtalk.config.CustomUserDetailsService;
import com.amakakeru.devtalk.config.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class VerificationService {

	@Autowired
	ApplicationContext context;
	@Autowired
	private JWTService jwtService;

	public boolean verifyToken(String token) {
		String username = jwtService.extractUserName(token);
		String email = jwtService.extractEmail(token);
		if (username != null && email != null) {
			UserDetails userDetails = context.getBean(CustomUserDetailsService.class).loadUserByUsername(email);
			return jwtService.validateVerificationToken(token, userDetails);
		}
		return false;
	}
}
