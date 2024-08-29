package com.amakakeru.devtalk.controller;

import com.amakakeru.devtalk.config.JWTService;
import com.amakakeru.devtalk.model.User;
import com.amakakeru.devtalk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

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
				String token = jwtService.generateToken(userFetched);
				return ResponseEntity.ok(token);
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

		user.setPassword(encoder.encode(user.getPassword()));

		User savedUser = userRepository.save(user);
		String token = jwtService.generateToken(savedUser);

		return ResponseEntity.status(HttpStatus.CREATED)
				.body(token);
	}
}
