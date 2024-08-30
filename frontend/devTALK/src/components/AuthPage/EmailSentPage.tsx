import { useNavigate, useParams } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faInbox } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { errorMessageService } from "../../contexts/ErrorMessageService.ts";

function getEmailProviderUrl(email: string): string {
	const domain = email.split("@")[1];
	switch (domain) {
		case "gmail.com":
			return "https://mail.google.com";
		case "yahoo.com":
			return "https://mail.yahoo.com";
		case "outlook.com":
		case "hotmail.com":
			return "https://outlook.live.com";
		case "aol.com":
			return "https://mail.aol.com";
		case "icloud.com":
			return "https://www.icloud.com/mail";
		default:
			return "https://mail.google.com";
	}
}

function EmailSentPage() {
	const { email } = useParams<{ email: string }>();
	const providerUrl = getEmailProviderUrl(email || "");
	const navigate = useNavigate();

	useEffect(() => {
		if (!email) {
			errorMessageService.errorMessage(
				"Email not found. Please provide a valid email address.",
			);
			navigate("/");
		}
	}, [email]);

	const handleVisitEmailProvider = () => {
		window.open(providerUrl, "_blank");
	};

	return (
		<div className="flex flex-col items-center justify-center h-[calc(100vh-3.75rem)] text-white px-4 sm:px-6 md:px-8 lg:px-12">
			<div className="text-center space-y-4 sm:space-y-6">
				<motion.div
					className="flex justify-center mb-4"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6 }}
				>
					<CheckCircleIcon className="h-24 w-24 sm:h-32 sm:w-32 text-green-500" />
				</motion.div>
				<h1 className="text-2xl sm:text-3xl font-bold mb-2">
					Verification Email Sent!
				</h1>
				<p className="text-base sm:text-lg flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-x-2 sm:space-y-0">
					<span className="text-gray-400">
						A verification email has been sent to
					</span>
					<span className="flex items-center space-x-1">
						<FontAwesomeIcon
							icon={faEnvelope}
							className="text-gray-400"
						/>
						<span className="font-semibold text-indigo-400">
							{email}
						</span>
					</span>
					<span className="text-gray-400">
						Please check your inbox and follow the instructions to
						verify your email address.
					</span>
				</p>
				<p className="text-xs sm:text-sm text-gray-400 mt-2">
					Note: The verification link will expire in 10 minutes.
				</p>
				<motion.div
					className="flex justify-center mt-4"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
				>
					<button
						onClick={handleVisitEmailProvider}
						className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200"
					>
						<FontAwesomeIcon
							icon={faInbox}
							className="text-white"
						/>
						<span className="text-sm sm:text-base">
							Open Your Inbox
						</span>
					</button>
				</motion.div>
			</div>
		</div>
	);
}

export default EmailSentPage;
