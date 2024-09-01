package com.amakakeru.devtalk.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HeaderDTO {
	public String profilePicture;
	public long totalPendingConnections;
}
