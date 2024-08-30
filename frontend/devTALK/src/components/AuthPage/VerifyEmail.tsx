import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { errorMessageService } from "../../contexts/ErrorMessageService.ts";
import { successMessageService } from "../../contexts/SuccessMessageService.ts";
import FullScreenLoading from "../utils/FullScreenLoading.tsx";
import { verifyEmail } from "../../api/AuthAPI.ts";
import { StatusCodes } from "http-status-codes";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCheckCircle,
	faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

function VerifyEmail() {
	const { token } = useParams<{ token: string }>();
	const navigate = useNavigate();
	const [isFullscreenLoading, setIsFullscreenLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	useEffect(() => {
		if (!token) {
			errorMessageService.errorMessage(
				"Token not found. Please provide a valid token.",
			);
			navigate("/");
		} else {
			const CheckToken = async () => {
				setIsFullscreenLoading(true);
				try {
					const response = await verifyEmail(token);
					if (
						response.status === StatusCodes.OK ||
						response.status == StatusCodes.CONFLICT
					) {
						successMessageService.successMessage(response.data);
						setSuccess(response.data);
					} else if (response.status == StatusCodes.BAD_REQUEST) {
						errorMessageService.errorMessage(response.data);
						setError(response.data);
					} else {
						setError(
							"Invalid token. Please provide a valid token.",
						);
					}
				} catch (error) {
					setError("An error occurred. Please try again later.");
				}

				setIsFullscreenLoading(false);
			};
			CheckToken();
		}
	}, [token]);

	return (
		<div className="flex flex-col items-center justify-center h-[calc(100vh-3.75rem)] text-white px-4 sm:px-6 md:px-8 lg:px-12">
			<FullScreenLoading isFullscreenLoading={isFullscreenLoading} />
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				className="flex flex-col items-center justify-center space-y-4"
			>
				{error && (
					<div className="text-center">
						<FontAwesomeIcon
							icon={faTimesCircle}
							className="text-red-500 text-3xl mb-2 h-32 w-32"
						/>
						<p className="text-red-500 text-3xl">{error}</p>
					</div>
				)}
				{success && (
					<div className="text-center">
						<FontAwesomeIcon
							icon={faCheckCircle}
							className="text-green-500 text-3xl mb-2 h-32 w-32"
						/>
						<p className="text-green-500 text-3xl">{success}</p>
						<button
							onClick={() => navigate("/login")}
							className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
						>
							Go to Login
						</button>
					</div>
				)}
			</motion.div>
		</div>
	);
}

export default VerifyEmail;
