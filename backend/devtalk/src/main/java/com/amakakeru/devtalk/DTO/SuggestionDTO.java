package com.amakakeru.devtalk.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuggestionDTO {
	private String username;
	private String profilePicture;
	private String name;
}