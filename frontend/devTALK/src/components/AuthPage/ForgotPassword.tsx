import { motion } from "framer-motion";
import FullScreenLoading from "../utils/FullScreenLoading.tsx";
import React, { useState } from "react";
import { MailOutlined } from "@ant-design/icons";
import { successMessageService } from "../../contexts/SuccessMessageService.ts";
import { errorMessageService } from "../../contexts/ErrorMessageService.ts";
import { passwordReset } from "../../api/AuthAPI.ts";
import { StatusCodes } from "http-status-codes";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
	const [isFullscreenLoading, setIsFullscreenLoading] = useState(false);
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const validateEmail = (): boolean => {
		if (!email) {
			setError("Email is required");
			return false;
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			setError("Email is invalid");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		if (validateEmail()) {
			setIsFullscreenLoading(true);
			const response = await passwordReset(email);
			if (response.status === StatusCodes.OK) {
				successMessageService.successMessage(response.data);
				navigate("/email-sent/" + email);
			} else {
				errorMessageService.errorMessage(response.data);
				setError(response.data);
			}
			setIsFullscreenLoading(false);
		}
	};
	return (
		<div className="flex items-center justify-center h-[calc(100vh-3.75rem)] px-4 select-none">
			<FullScreenLoading isFullscreenLoading={isFullscreenLoading} />
			<motion.form
				onSubmit={handleSubmit}
				className="bg-gray-800 p-8 rounded-lg w-full max-w-md relative"
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<h2 className="text-2xl font-bold mb-6 text-white text-center">
					Request Password Reset
				</h2>

				<div className="mb-4 relative">
					<MailOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
					<input
						id="email"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="pl-10 pr-3 py-2 w-full bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:border-indigo-500"
						type="email"
						placeholder="Email"
					/>
				</div>
				{error && <p className="text-red-500 text-xs mb-4">{error}</p>}

				<button
					type="submit"
					className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded focus:outline-none focus:bg-indigo-600 transition-colors duration-300"
				>
					Get Reset Link
				</button>
			</motion.form>
		</div>
	);
}

export default ForgotPassword;
