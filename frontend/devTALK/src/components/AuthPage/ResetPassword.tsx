import { motion } from "framer-motion";
import FullScreenLoading from "../utils/FullScreenLoading.tsx";
import React, { useEffect, useState } from "react";
import {
	EyeInvisibleOutlined,
	EyeTwoTone,
	LockOutlined,
} from "@ant-design/icons";
import { successMessageService } from "../../contexts/SuccessMessageService.ts";
import { errorMessageService } from "../../contexts/ErrorMessageService.ts";
import { StatusCodes } from "http-status-codes";
import { useNavigate, useParams } from "react-router-dom";
import { passwordResetPost } from "../../api/AuthAPI.ts";

function ResetPassword() {
	const { token } = useParams<{ token: string }>();
	const [isFullscreenLoading, setIsFullscreenLoading] = useState(false);
	const [password, sePassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		if (!token) {
			errorMessageService.errorMessage(
				"Token not found. Please provide a valid token.",
			);
			navigate("/");
		}
	}, [token]);

	const validatePassword = (): boolean => {
		if (!password) {
			setError("Password is required");
			return false;
		} else if (password.length < 6 || password.length > 40) {
			setError("Password must be between 6 and 40 characters");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		if (validatePassword() && token) {
			setIsFullscreenLoading(true);
			const response = await passwordResetPost(token, {
				password: password,
			});
			if (response.status === StatusCodes.OK) {
				successMessageService.successMessage(response.data);
				navigate("/login");
			} else if (response.status === StatusCodes.BAD_REQUEST) {
				errorMessageService.errorMessage(response.data);
				setError(response.data);
			} else {
				errorMessageService.errorMessage(
					"Something went wrong. Please try again.",
				);
				setError("Something went wrong. Please try again.");
			}

			setIsFullscreenLoading(false);
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
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
					Reset Password
				</h2>

				<div className="mb-4 relative">
					<LockOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
					<input
						id="password"
						name="password"
						value={password}
						onChange={(e) => sePassword(e.target.value)}
						className="pl-10 pr-3 py-2 w-full bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:border-indigo-500"
						type={showPassword ? "text" : "password"}
						placeholder="Password"
					/>
					<div
						className="absolute inset-y-0 right-0 pr-3 pt-1 flex items-center cursor-pointer"
						onClick={togglePasswordVisibility}
					>
						{showPassword ? (
							<EyeTwoTone className="text-gray-400" />
						) : (
							<EyeInvisibleOutlined className="text-gray-400" />
						)}
					</div>
				</div>
				{error && <p className="text-red-500 text-xs mb-4">{error}</p>}

				<button
					type="submit"
					className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded focus:outline-none focus:bg-indigo-600 transition-colors duration-300"
				>
					Reset Password
				</button>
			</motion.form>
		</div>
	);
}

export default ResetPassword;
