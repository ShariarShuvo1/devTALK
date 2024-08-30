package com.amakakeru.devtalk.service;

import com.amakakeru.devtalk.config.JWTService;
import com.amakakeru.devtalk.model.User;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

	@Autowired
	private JavaMailSender javaMailSender;
	@Autowired
	private JWTService jwtService;

	public void sendVerificationEmail(User user) throws jakarta.mail.MessagingException {
		String verificationToken = jwtService.generateVerificationToken(user);
		String to = user.getEmail();
		String subject = "Email Verification - devTALK";
		String htmlBody = "<div style=\"font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;\">"
				+ "<div style=\"max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\">"
				+ "<h2 style=\"color: #2a9d8f; text-align: center;\">Welcome to devTALK!</h2>"
				+ "<hr style=\"border: 0; height: 1px; background-color: #e9e9e9; margin: 20px 0;\"/>"
				+ "<p style=\"font-size: 1.1em; color: #333; line-height: 1.6;\">Hi there,</p>"
				+ "<p style=\"font-size: 1.1em; color: #333; line-height: 1.6;\">Thank you for registering with <strong>devTALK</strong>. To complete your registration, please verify your email address by clicking the button below:</p>"
				+ "<p style=\"text-align: center; margin: 40px 0;\">"
				+ "<a href=\"http://localhost:5173/verifyEmail/" + verificationToken
				+ "\" style=\"display: inline-block; padding: 12px 24px; font-size: 1.1em; color: white; background-image: linear-gradient(135deg, #2a9d8f, #264653); text-decoration: none; border-radius: 25px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);\">Verify Email</a>"
				+ "</p>"
				+ "<p style=\"font-size: 0.9em; color: #777; line-height: 1.6; text-align: center;\">This link is valid for <strong>10 minutes</strong>. If you did not request this verification, please ignore this email.</p>"
				+ "<p style=\"font-size: 1em; color: #333; line-height: 1.6; text-align: center; margin-top: 40px;\">Best regards,<br/><strong>The devTALK Team</strong></p>"
				+ "<hr style=\"border: 0; height: 1px; background-color: #e9e9e9; margin: 40px 0;\"/>"
				+ "<footer style=\"font-size: 0.8em; color: #777; text-align: center;\">"
				+ "<p style=\"margin: 0;\">devTALK | Empowering Developers</p>"
				+ "<p style=\"margin: 0;\">Follow us on <a href=\"#\" style=\"color: #2a9d8f; text-decoration: none;\">LinkedIn</a>, <a href=\"#\" style=\"color: #2a9d8f; text-decoration: none;\">Twitter</a>, and <a href=\"#\" style=\"color: #2a9d8f; text-decoration: none;\">Facebook</a></p>"
				+ "</footer>"
				+ "</div>"
				+ "</div>";
		MimeMessage message = javaMailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);
		helper.setTo(to);
		helper.setSubject(subject);
		helper.setText(htmlBody, true);
		javaMailSender.send(message);
	}

	public void sendPasswordResetEmail(User user) throws jakarta.mail.MessagingException {
		String verificationToken = jwtService.generateVerificationToken(user);
		String to = user.getEmail();
		String subject = "Password Reset - devTALK";
		String htmlBody = "<div style=\"font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;\">"
				+ "<div style=\"max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\">"
				+ "<h2 style=\"color: #2a9d8f; text-align: center;\">Password Reset Request</h2>"
				+ "<hr style=\"border: 0; height: 1px; background-color: #e9e9e9; margin: 20px 0;\"/>"
				+ "<p style=\"font-size: 1.1em; color: #333; line-height: 1.6;\">Hi there,</p>"
				+ "<p style=\"font-size: 1.1em; color: #333; line-height: 1.6;\">We received a request to reset your password for your <strong>devTALK</strong> account. To reset your password, please click the button below:</p>"
				+ "<p style=\"text-align: center; margin: 40px 0;\">"
				+ "<a href=\"http://localhost:5173/resetPassword/" + verificationToken
				+ "\" style=\"display: inline-block; padding: 12px 24px; font-size: 1.1em; color: white; background-image: linear-gradient(135deg, #2a9d8f, #264653); text-decoration: none; border-radius: 25px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);\">Reset Password</a>"
				+ "</p>"
				+ "<p style=\"font-size: 0.9em; color: #777; line-height: 1.6; text-align: center;\">This link is valid for <strong>10 minutes</strong>. If you did not request this password reset, please ignore this email.</p>"
				+ "<p style=\"font-size: 1em; color: #333; line-height: 1.6; text-align: center; margin-top: 40px;\">Best regards,<br/><strong>The devTALK Team</strong></p>"
				+ "<hr style=\"border: 0; height: 1px; background-color: #e9e9e9; margin: 40px 0;\"/>"
				+ "<footer style=\"font-size: 0.8em; color: #777; text-align: center;\">"
				+ "<p style=\"margin: 0;\">devTALK | Empowering Developers</p>"
				+ "<p style=\"margin: 0;\">Follow us on <a href=\"#\" style=\"color: #2a9d8f; text-decoration: none;\">LinkedIn</a>, <a href=\"#\" style=\"color: #2a9d8f; text-decoration: none;\">Twitter</a>, and <a href=\"#\" style=\"color: #2a9d8f; text-decoration: none;\">Facebook</a></p>"
				+ "</footer>"
				+ "</div>"
				+ "</div>";

		MimeMessage message = javaMailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);
		helper.setTo(to);
		helper.setSubject(subject);
		helper.setText(htmlBody, true);
		javaMailSender.send(message);
	}
}
