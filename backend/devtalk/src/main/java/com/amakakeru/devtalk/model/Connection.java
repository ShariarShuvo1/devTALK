package com.amakakeru.devtalk.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "connections")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Connection {
	@Id
	private String id;

	private String requesterId;

	private String recipientId;

	@Builder.Default
	private ConnectionStatus status = ConnectionStatus.PENDING;

	private Date requestedAt;

	private Date acceptedAt;

	public enum ConnectionStatus {
		PENDING,
		ACCEPTED,
		REJECTED,
		BLOCKED
	}
}
