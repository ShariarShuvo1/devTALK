package com.amakakeru.devtalk.repository;

import com.amakakeru.devtalk.model.Connection;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConnectionRepository extends MongoRepository<Connection, String> {
	Connection findByRequesterIdAndRecipientId(String requesterId, String recipientId);

	List<Connection> findAllByRequesterIdOrRecipientId(String requesterId, String recipientId);
}
