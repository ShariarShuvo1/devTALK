package com.amakakeru.devtalk.controller;

import com.amakakeru.devtalk.config.JWTService;
import com.amakakeru.devtalk.model.User;
import com.amakakeru.devtalk.repository.UserRepository;
import com.amakakeru.devtalk.service.EmailService;
import com.amakakeru.devtalk.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@RestController
@RequiredArgsConstructor
public class AuthController {
	@Autowired
	private final UserRepository userRepository;
	private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
	@Autowired
	AuthenticationManager authenticationManager;
	@Autowired
	private JWTService jwtService;
	@Autowired
	private VerificationService verificationService;
	@Autowired
	private EmailService emailService;

	@GetMapping("/checkUsername/{username}")
	public ResponseEntity<Boolean> checkUsername(@PathVariable String username) {
		return ResponseEntity.ok(userRepository.findByUsername(username) != null);
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody User user) {
		try {
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
			);
			if (authentication.isAuthenticated()) {
				User userFetched = userRepository.findByEmail(user.getEmail());
				if (!userFetched.getIsEmailVerified()) {
					try {
						emailService.sendVerificationEmail(userFetched);
					} catch (Exception e) {
						return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
								.body("An error occurred while registering user");
					}
					return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY).body("Email not verified");
				}
				String token = jwtService.generateToken(userFetched);
				boolean hasProfilePicture = userFetched.getProfilePicture() != null;

				Map<String, Object> response = new HashMap<>();
				response.put("token", token);
				response.put("hasProfilePicture", hasProfilePicture);

				return ResponseEntity.ok(response);
			}

			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
		}
	}


	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody User user) {
		if (userRepository.findByEmail(user.getEmail()) != null) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body("Email already exists");
		}
		if (userRepository.findByUsername(user.getUsername()) != null) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body("Username already exists");
		}
		if (user.getRoles().isEmpty()) {
			user.setRoles(null);
		}

		if (Objects.isNull(user.getEmail()) || user.getEmail().isEmpty() ||
				Objects.isNull(user.getUsername()) || user.getUsername().isEmpty() ||
				Objects.isNull(user.getName()) || user.getName().isEmpty() ||
				Objects.isNull(user.getPassword()) || user.getPassword().isEmpty() ||
				Objects.isNull(user.getDob())) {

			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("All fields are required");
		}

		try {
			user.setPassword(encoder.encode(user.getPassword()));
			User savedUser = userRepository.save(user);
			emailService.sendVerificationEmail(savedUser);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while registering user");
		}

		return ResponseEntity.status(HttpStatus.CREATED)
				.body("User registered successfully");
	}

	@GetMapping("/verifyEmail/{token}")
	public ResponseEntity<?> verifyEmail(@PathVariable String token) {
		if (token == null || token.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("Token is required");
		}
		if (verificationService.verifyToken(token)) {
			String email = jwtService.extractEmail(token);
			User user = userRepository.findByEmail(email);
			if (user == null) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body("Invalid token. Please provide a valid token");
			}
			if (user.getIsEmailVerified()) {
				return ResponseEntity.status(HttpStatus.CONFLICT)
						.body("Email already verified");
			}
			user.setEmailVerified(true);
			userRepository.save(user);
			return ResponseEntity.ok("Email verified successfully");
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body("Invalid token. Please provide a valid token");
	}

	@GetMapping("/passwordReset/{email}")
	public ResponseEntity<?> passwordReset(@PathVariable String email) {
		if (email == null || email.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("Email is required");
		}
		User user = userRepository.findByEmail(email);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("User not found. Please provide a valid email");
		}
		try {
			emailService.sendPasswordResetEmail(user);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("An error occurred while sending password reset email");
		}
		return ResponseEntity.ok("Password reset email sent successfully");
	}

	@PostMapping("/passwordReset/{token}")
	public ResponseEntity<?> resetPassword(@PathVariable String token, @RequestBody User user) {
		if (token == null || token.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("Token is required");
		}
		if (user.getPassword() == null || user.getPassword().isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body("Password is required");
		}
		if (verificationService.verifyToken(token)) {
			String email = jwtService.extractEmail(token);
			User userFetched = userRepository.findByEmail(email);
			if (userFetched == null) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body("Invalid token. Please provide a valid token");
			}
			userFetched.setPassword(encoder.encode(user.getPassword()));
			userRepository.save(userFetched);
			return ResponseEntity.ok("Password reset successfully. Please login with your new password");
		}
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body("Invalid token. Please provide a valid token");
	}
}
