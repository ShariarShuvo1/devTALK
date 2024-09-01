package com.amakakeru.devtalk.controller;

import com.amakakeru.devtalk.DTO.HeaderDTO;
import com.amakakeru.devtalk.model.Connection;
import com.amakakeru.devtalk.model.User;
import com.amakakeru.devtalk.repository.ConnectionRepository;
import com.amakakeru.devtalk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/header")
public class HeaderController {
	@Autowired
	private final UserRepository userRepository;


	@Autowired
	private ConnectionRepository connectionRepository;

	@GetMapping("/getHeaderInfo")
	public ResponseEntity<?> getHeaderInfo(Authentication authentication) {
		User user = userRepository.findByEmail(authentication.getName());

		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
		}

		String profilePicture = user.getProfilePicture();
		if (profilePicture == null || profilePicture.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile picture not found");
		}

		long totalPendingConnections = connectionRepository.countByRecipientIdAndStatus(user.getId(), Connection.ConnectionStatus.PENDING);
		HeaderDTO headerDTO = new HeaderDTO(profilePicture, totalPendingConnections);

		return ResponseEntity.ok(headerDTO);
	}
}
