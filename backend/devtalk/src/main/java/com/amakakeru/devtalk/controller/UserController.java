package com.amakakeru.devtalk.controller;

import com.amakakeru.devtalk.model.User;
import com.amakakeru.devtalk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

	private static final String UPLOAD_DIR = "uploaded_images";
	@Autowired
	private final UserRepository userRepository;

	@GetMapping("/getProfilePicture/{username}")
	public ResponseEntity<String> getProfilePicture(@PathVariable String username) {
		if (username == null || username.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is empty");
		}
		
		User user = userRepository.findByUsername(username);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
		}

		String profilePicture = user.getProfilePicture();
		if (profilePicture == null || profilePicture.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile picture not found");
		}

		return ResponseEntity.ok(profilePicture);
	}

	@PostMapping("/updateProfilePicture")
	public ResponseEntity<String> updateProfilePicture(@RequestParam("profilePicture") MultipartFile file, Authentication authentication) {
		if (file.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No file chosen");
		}

		File uploadDir = new File(UPLOAD_DIR);
		if (!uploadDir.exists()) {
			uploadDir.mkdir();
		}

		try {
			String email = authentication.getName();
			User user = userRepository.findByEmail(email);
			if (user == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
			}

			String oldProfilePicture = user.getProfilePicture();
			if (oldProfilePicture != null && !oldProfilePicture.isEmpty()) {
				String oldFileName = oldProfilePicture.substring(oldProfilePicture.lastIndexOf('/') + 1);
				File oldFile = new File(UPLOAD_DIR + File.separator + oldFileName);
				if (oldFile.exists()) {
					oldFile.delete();
				}
			}

			String originalFilename = file.getOriginalFilename();
			if (originalFilename == null) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File name is null");
			}
			String fileName = System.currentTimeMillis() + "_" + originalFilename;
			String filePath = UPLOAD_DIR + File.separator + fileName;
			Path path = Paths.get(filePath);
			Files.write(path, file.getBytes());

			String imageUrl = "http://localhost:8080/profilePicture/" + fileName;
			user.setProfilePicture(imageUrl);
			userRepository.save(user);
			return ResponseEntity.ok("Profile picture uploaded successfully");

		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file");
		}
	}


}
