package com.amakakeru.devtalk.repository;

import com.amakakeru.devtalk.model.Connection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConnectionRepository extends MongoRepository<Connection, String> {
	Connection findByRequesterIdAndRecipientId(String requesterId, String recipientId);

	List<Connection> findAllByRequesterIdOrRecipientId(String requesterId, String recipientId);

	long countByRecipientIdAndStatus(String recipientId, Connection.ConnectionStatus status);

	Page<Connection> findAllByRequesterIdOrRecipientIdAndStatus(
			String requesterId, String recipientId, Connection.ConnectionStatus status, Pageable pageable);

	Page<Connection> findAllByRequesterIdOrRecipientId(
			String requesterId, String recipientId, Pageable pageable);

	Page<Connection> findAllByRecipientIdAndStatus(
			String recipientId, Connection.ConnectionStatus status, Pageable pageable);

	Page<Connection> findAllByRequesterIdAndStatus(
			String requesterId, Connection.ConnectionStatus status, Pageable pageable);

}
