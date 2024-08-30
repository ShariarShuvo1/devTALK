package com.amakakeru.devtalk.config;

import com.amakakeru.devtalk.model.Role;
import com.amakakeru.devtalk.model.User;
import com.amakakeru.devtalk.repository.UserRepository;
import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JWTService {

	Dotenv dotenv = Dotenv.load();
	private final String secretkey = dotenv.get("APP_SECRET_KEY");

	@Autowired
	private UserRepository userRepository;

	public String generateToken(User user) {
		Map<String, Object> claims = new HashMap<>();
		claims.put("roles", user.getRoles().stream()
				.map(Role::name)
				.collect(Collectors.toList()));

		return Jwts.builder()
				.claims()
				.add(claims)
				.subject(user.getUsername())
				.issuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis() + 30L * 24 * 60 * 60 * 1000))
				.and()
				.signWith(getKey())
				.compact();

	}

	public String generateVerificationToken(User user) {
		Map<String, Object> claims = new HashMap<>();
		claims.put("roles", user.getRoles().stream()
				.map(Role::name)
				.collect(Collectors.toList()));
		claims.put("verification_token", true);

		return Jwts.builder()
				.claims()
				.add(claims)
				.subject(user.getUsername())
				.issuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis() + 10L * 60 * 1000))
				.and()
				.signWith(getKey())
				.compact();

	}

	private SecretKey getKey() {
		byte[] keyBytes = Decoders.BASE64.decode(secretkey);
		return Keys.hmacShaKeyFor(keyBytes);
	}

	public String extractUserName(String token) {
		return extractClaim(token, Claims::getSubject);
	}

	public Boolean extractVerificationToken(String token) {
		Claims claims = extractAllClaims(token);
		return claims.get("verification_token", Boolean.class);
	}

	public String extractEmail(String token) {
		String username = extractClaim(token, Claims::getSubject);
		User user = userRepository.findByUsername(username);
		return user.getEmail();
	}

	private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
		final Claims claims = extractAllClaims(token);
		return claimResolver.apply(claims);
	}

	Claims extractAllClaims(String token) {
		return Jwts.parser()
				.verifyWith(getKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}

	public boolean validateToken(String token, UserDetails userDetails) {
		final String userName = extractUserName(token);
		String newUsername = userRepository.findByEmail(userDetails.getUsername()).getUsername();
		return (userName.equals(newUsername) && !isTokenExpired(token));
	}

	public boolean validateVerificationToken(String token, UserDetails userDetails) {
		final String userName = extractUserName(token);
		final Boolean verificationToken = extractVerificationToken(token);
		String newUsername = userRepository.findByEmail(userDetails.getUsername()).getUsername();
		return (userName.equals(newUsername) && !isTokenExpired(token)) && verificationToken;
	}

	private boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}

	private Date extractExpiration(String token) {
		return extractClaim(token, Claims::getExpiration);
	}

}