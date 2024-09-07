package com.amakakeru.devtalk.controller;

import com.amakakeru.devtalk.DTO.SuggestionDTO;
import com.amakakeru.devtalk.model.Connection;
import com.amakakeru.devtalk.model.User;
import com.amakakeru.devtalk.repository.ConnectionRepository;
import com.amakakeru.devtalk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequiredArgsConstructor
@RequestMapping("/connection")
public class ConnectionController {

	@Autowired
	private ConnectionRepository connectionRepository;

	@Autowired
	private UserRepository userRepository;

	public ConnectionController(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@GetMapping("/suggestion/{page}")
	public ResponseEntity<List<SuggestionDTO>> getSuggestion(@PathVariable int page,
															 Authentication authentication) {
		User currentUser = userRepository.findByEmail(authentication.getName());

		List<String> connectedUserIds = connectionRepository.findAllByRequesterIdOrRecipientId(currentUser.getId(), currentUser.getId())
				.stream()
				.flatMap(connection -> Stream.of(connection.getRequesterId(), connection.getRecipientId()))
				.filter(id -> !id.equals(currentUser.getId()))
				.collect(Collectors.toList());

		connectedUserIds.add(currentUser.getId());

		Pageable pageable = PageRequest.of(page, 15);
		Page<User> userPage = userRepository.findAllByIdNotIn(connectedUserIds, pageable);

		List<SuggestionDTO> suggestedConnections = userPage.getContent()
				.stream()
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

	@GetMapping("/myConnections/{page}")
	public ResponseEntity<List<SuggestionDTO>> getMyConnections(
			@PathVariable int page,
			@RequestParam(defaultValue = "15") int size,
			Authentication authentication) {

		User user = userRepository.findByEmail(authentication.getName());

		Pageable pageable = PageRequest.of(page, size);
		Page<Connection> connectionsPage = connectionRepository.findAllByRequesterIdOrRecipientId(user.getId(), user.getId(), pageable);

		List<SuggestionDTO> suggestionDTOList = connectionsPage.getContent().stream()
				.filter(connection -> connection.getStatus() == Connection.ConnectionStatus.ACCEPTED)
				.map(connection -> {
					User connectedUser = user.getId().equals(connection.getRequesterId()) ?
							userRepository.findById(connection.getRecipientId()).orElse(null) :
							userRepository.findById(connection.getRequesterId()).orElse(null);
					return new SuggestionDTO(connectedUser.getUsername(), connectedUser.getProfilePicture(), connectedUser.getName());
				})
				.filter(Objects::nonNull)
				.collect(Collectors.toList());

		// Return ResponseEntity with List<SuggestionDTO>
		return ResponseEntity.ok(suggestionDTOList);
	}


	@GetMapping("/pendingRequests/{page}")
	public ResponseEntity<List<SuggestionDTO>> getPendingRequests(@PathVariable int page, Authentication authentication) {
		Pageable pageable = PageRequest.of(page, 15);
		User user = userRepository.findByEmail(authentication.getName());

		Page<Connection> connectionsPage = connectionRepository.findAllByRecipientIdAndStatus(
				user.getId(), Connection.ConnectionStatus.PENDING, pageable);

		List<SuggestionDTO> pendingRequests = connectionsPage.getContent().stream()
				.map(connection -> {
					String requesterId = connection.getRequesterId().equals(user.getId())
							? connection.getRecipientId()
							: connection.getRequesterId();
					User requester = userRepository.findById(requesterId).orElse(null);
					return new SuggestionDTO(requester.getUsername(), requester.getProfilePicture(), requester.getName());
				})
				.collect(Collectors.toList());

		return ResponseEntity.ok(pendingRequests);
	}


	@GetMapping("/sentRequests/{page}")
	public ResponseEntity<List<SuggestionDTO>> getSentRequests(@PathVariable int page, Authentication authentication) {
		Pageable pageable = PageRequest.of(page, 15);
		User user = userRepository.findByEmail(authentication.getName());

		Page<Connection> connectionsPage = connectionRepository.findAllByRequesterIdAndStatus(
				user.getId(), Connection.ConnectionStatus.PENDING, pageable);

		List<SuggestionDTO> pendingRequests = connectionsPage.getContent().stream()
				.map(connection -> {
					String requesterId = connection.getRequesterId().equals(user.getId())
							? connection.getRecipientId()
							: connection.getRequesterId();
					User requester = userRepository.findById(requesterId).orElse(null);
					return new SuggestionDTO(requester.getUsername(), requester.getProfilePicture(), requester.getName());
				})
				.collect(Collectors.toList());

		return ResponseEntity.ok(pendingRequests);
	}

	@DeleteMapping("/deleteSentConnection/{username}")
	public ResponseEntity<String> deleteConnection(@PathVariable String username, Authentication authentication) {
		User requester = userRepository.findByEmail(authentication.getName());
		User recipient = userRepository.findByUsername(username);

		if (recipient == null) {
			return ResponseEntity.badRequest().body("Recipient not found");
		}

		Connection connection = connectionRepository.findByRequesterIdAndRecipientId(requester.getId(), recipient.getId());
		if (connection == null) {
			connection = connectionRepository.findByRequesterIdAndRecipientId(recipient.getId(), requester.getId());
		}

		if (connection == null) {
			return ResponseEntity.badRequest().body("Connection not found");
		}

		connectionRepository.delete(connection);

		return ResponseEntity.ok("Connection deleted");
	}

}
