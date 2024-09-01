package com.amakakeru.devtalk.repository;

import com.amakakeru.devtalk.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
	User findByEmail(String email);

	User findByUsername(String username);

	Page<User> findAllByIdNot(String currentUserId, Pageable pageable);

	Page<User> findAllByIdNotIn(List<String> connectedUserIds, Pageable pageable);
}
