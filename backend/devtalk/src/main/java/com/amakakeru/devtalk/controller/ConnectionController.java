package com.amakakeru.devtalk.controller;

import com.amakakeru.devtalk.DTO.SuggestionDTO;
import com.amakakeru.devtalk.model.Connection;
import com.amakakeru.devtalk.model.User;
import com.amakakeru.devtalk.repository.ConnectionRepository;
import com.amakakeru.devtalk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/connection")
public class ConnectionController {

	@Autowired
	private ConnectionRepository connectionRepository;

	@Autowired
	private UserRepository userRepository;

	@GetMapping("/suggestion")
	public ResponseEntity<List<SuggestionDTO>> getSuggestion(Authentication authentication) {
		User currentUser = userRepository.findByEmail(authentication.getName());

		List<SuggestionDTO> suggestedConnections = userRepository.findAll()
				.stream()
				.filter(user -> !user.getId().equals(currentUser.getId()))
				.map(user -> new SuggestionDTO(user.getUsername(), user.getProfilePicture(), user.getName()))
				.collect(Collectors.toList());

		return ResponseEntity.ok(suggestedConnections);
	}

	@GetMapping("/newConnection/{recipientUsername}")
	public ResponseEntity<String> newConnection(@PathVariable String recipientUsername, Authentication authentication) {
		User requester = userRepository.findByEmail(authentication.getName());
		User recipient = userRepository.findByUsername(recipientUsername);

		if (recipient == null) {
			return ResponseEntity.badRequest().body("Recipient not found");
		}

		if (requester.getId().equals(recipient.getId())) {
			return ResponseEntity.badRequest().body("You cannot connect with yourself");
		}

		Connection connection = connectionRepository.findByRequesterIdAndRecipientId(requester.getId(), recipient.getId());
		if (connection != null) {
			return ResponseEntity.badRequest().body("Connection already exists");
		}

		connection = connectionRepository.findByRequesterIdAndRecipientId(recipient.getId(), requester.getId());
		if (connection != null) {
			return ResponseEntity.badRequest().body("Connection already exists");
		}

		connection = Connection.builder()
				.requesterId(requester.getId())
				.recipientId(recipient.getId())
				.requestedAt(new Date())
				.build();

		connectionRepository.save(connection);

		return ResponseEntity.ok("Connection request sent");
	}

	@GetMapping("/acceptConnection/{requesterUsername}")
	public ResponseEntity<String> acceptConnection(@PathVariable String requesterUsername, Authentication authentication) {
		User recipient = userRepository.findByEmail(authentication.getName());
		User requester = userRepository.findByUsername(requesterUsername);

		if (requester == null) {
			return ResponseEntity.badRequest().body("Requester not found");
		}

		Connection connection = connectionRepository.findByRequesterIdAndRecipientId(requester.getId(), recipient.getId());
		if (connection == null) {
			return ResponseEntity.badRequest().body("Connection request not found");
		}

		connection.setStatus(Connection.ConnectionStatus.ACCEPTED);
		connection.setAcceptedAt(new Date());
		connectionRepository.save(connection);

		return ResponseEntity.ok("Connection request accepted");
	}

	@GetMapping("/rejectConnection/{requesterUsername}")
	public ResponseEntity<String> rejectConnection(@PathVariable String requesterUsername, Authentication authentication) {
		User recipient = userRepository.findByEmail(authentication.getName());
		User requester = userRepository.findByUsername(requesterUsername);

		if (requester == null) {
			return ResponseEntity.badRequest().body("Requester not found");
		}

		Connection connection = connectionRepository.findByRequesterIdAndRecipientId(requester.getId(), recipient.getId());
		if (connection == null) {
			return ResponseEntity.badRequest().body("Connection request not found");
		}

		connection.setStatus(Connection.ConnectionStatus.REJECTED);
		connectionRepository.save(connection);

		return ResponseEntity.ok("Connection request rejected");
	}

	@GetMapping("/blockConnection/{requesterUsername}")
	public ResponseEntity<String> blockConnection(@PathVariable String requesterUsername, Authentication authentication) {
		User recipient = userRepository.findByEmail(authentication.getName());
		User requester = userRepository.findByUsername(requesterUsername);

		if (requester == null) {
			return ResponseEntity.badRequest().body("Requester not found");
		}

		Connection connection = connectionRepository.findByRequesterIdAndRecipientId(requester.getId(), recipient.getId());
		if (connection == null) {
			return ResponseEntity.badRequest().body("Connection request not found");
		}

		connection.setStatus(Connection.ConnectionStatus.BLOCKED);
		connectionRepository.save(connection);

		return ResponseEntity.ok("Connection request blocked");
	}

	@GetMapping("/myConnections")
	public ResponseEntity<List<SuggestionDTO>> getMyConnections(Authentication authentication) {
		User user = userRepository.findByEmail(authentication.getName());

		List<Connection> connections = connectionRepository.findAllByRequesterIdOrRecipientId(user.getId(), user.getId());
		List<SuggestionDTO> myConnections = connections.stream()
				.filter(connection -> connection.getStatus() == Connection.ConnectionStatus.ACCEPTED)
				.map(connection -> {
					User connectedUser = user.getId().equals(connection.getRequesterId()) ?
							userRepository.findById(connection.getRecipientId()).orElse(null) :
							userRepository.findById(connection.getRequesterId()).orElse(null);
					return new SuggestionDTO(connectedUser.getUsername(), connectedUser.getProfilePicture(), connectedUser.getName());
				})
				.collect(Collectors.toList());

		return ResponseEntity.ok(myConnections);
	}

	@GetMapping("/pendingRequests")
	public ResponseEntity<List<SuggestionDTO>> getPendingRequests(Authentication authentication) {
		User user = userRepository.findByEmail(authentication.getName());

		List<Connection> connections = connectionRepository.findAllByRequesterIdOrRecipientId(user.getId(), user.getId());
		List<SuggestionDTO> pendingRequests = connections.stream()
				.filter(connection -> connection.getStatus() == Connection.ConnectionStatus.PENDING)
				.map(connection -> {
					User requester = userRepository.findById(connection.getRequesterId()).orElse(null);
					return new SuggestionDTO(requester.getUsername(), requester.getProfilePicture(), requester.getName());
				})
				.collect(Collectors.toList());

		return ResponseEntity.ok(pendingRequests);
	}

	@GetMapping("/sentRequests")
	public ResponseEntity<List<SuggestionDTO>> getSentRequests(Authentication authentication) {
		User user = userRepository.findByEmail(authentication.getName());

		List<Connection> connections = connectionRepository.findAllByRequesterIdOrRecipientId(user.getId(), user.getId());
		List<SuggestionDTO> sentRequests = connections.stream()
				.filter(connection -> connection.getStatus() == Connection.ConnectionStatus.PENDING)
				.map(connection -> {
					User recipient = userRepository.findById(connection.getRecipientId()).orElse(null);
					return new SuggestionDTO(recipient.getUsername(), recipient.getProfilePicture(), recipient.getName());
				})
				.collect(Collectors.toList());

		return ResponseEntity.ok(sentRequests);
	}

}
