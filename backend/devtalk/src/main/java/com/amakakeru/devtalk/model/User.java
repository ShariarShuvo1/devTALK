package com.amakakeru.devtalk.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Collections;
import java.util.Date;
import java.util.Set;

@Data
@Document(collection = "users")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
	@Id
	private String id;

	@NotBlank(message = "Email is required")
	@Email(message = "Email should be valid")
	private String email;

	@NotBlank(message = "Username is required")
	@Size(min = 3, max = 20, message = "Username should be between 3 and 20 characters")
	private String username;

	@NotBlank(message = "Name is required")
	@Size(min = 3, max = 50, message = "Name should be between 3 and 50 characters")
	private String name;

	@NotBlank(message = "Password is required")
	@Size(min = 6, max = 40, message = "Password should be between 6 and 40 characters")
	private String password;

	@NotBlank(message = "Date of birth is required")
	private Date dob;

	private String profilePicture;

	@Size(max = 200, message = "Bio should be less than 200 characters")
	private String bio;

	@Builder.Default
	private boolean isBanned = false;

	private Date banUntil;

	private Date createdAt;

	@Builder.Default
	private boolean isEmailVerified = false;

	@Builder.Default
	private Set<Role> roles = Collections.singleton(Role.USER);

	public boolean getIsEmailVerified() {
		return isEmailVerified;
	}
}
