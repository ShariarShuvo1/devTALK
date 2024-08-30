import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { successMessageService } from "../../contexts/SuccessMessageService.ts";
import { errorMessageService } from "../../contexts/ErrorMessageService.ts";
import { StatusCodes } from "http-status-codes";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { login } from "../../api/AuthAPI.ts";
import FullScreenLoading from "../utils/FullScreenLoading.tsx";
import {
	EyeInvisibleOutlined,
	EyeTwoTone,
	LockOutlined,
	MailOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const Login: React.FC = () => {
	const [formData, setFormData] = useState<{
		email: string;
		password: string;
	}>({
		email: "",
		password: "",
	});

	const [errors, setErrors] = useState<{
		email?: string;
		password?: string;
	}>({});
	const [serverError, setServerError] = useState<string>("");
	const navigate = useNavigate();
	const { setJWT } = useAuth();
	const [isFullscreenLoading, setIsFullscreenLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const validateForm = (): boolean => {
		const newErrors: { email?: string; password?: string } = {};

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setServerError("");

		if (validateForm()) {
			setIsFullscreenLoading(true);
			const response = await login(formData);
			if (response.status === StatusCodes.OK) {
				setJWT(response.data);
				successMessageService.successMessage("Login successful");
				navigate("/");
			} else if (response.status === StatusCodes.FAILED_DEPENDENCY) {
				errorMessageService.errorMessage(response.data);
				navigate("/email-sent/" + formData.email);
			} else if (response.data) {
				setServerError(response.data);
			} else {
				setServerError("An error occurred during login.");
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
					Login
				</h2>

				<div className="mb-4 relative">
					<MailOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
					<input
						id="email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
						className="pl-10 pr-3 py-2 w-full bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:border-indigo-500"
						type="email"
						placeholder="Email"
					/>
				</div>
				{errors.email && (
					<p className="text-red-500 text-xs mb-4">{errors.email}</p>
				)}

				<div className="mb-4 relative">
					<LockOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
					<input
						id="password"
						name="password"
						value={formData.password}
						onChange={handleInputChange}
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
				{errors.password && (
					<p className="text-red-500 text-xs mb-4">
						{errors.password}
					</p>
				)}

				<button
					type="submit"
					className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded focus:outline-none focus:bg-indigo-600 transition-colors duration-300"
				>
					Login
				</button>

				{serverError && (
					<p className="text-red-500 text-center mt-4">
						{serverError}
					</p>
				)}

				<div className="mt-4">
					<div
						className="text-indigo-400 hover:underline cursor-pointer"
						onClick={() => navigate("/forgot-password")}
					>
						Forgot Password?
					</div>
				</div>
				<div className="mt-4">
					<div className="text-indigo-400 text-center">
						Don't have an account?{" "}
						<span
							className="text-indigo-500 hover:underline cursor-pointer"
							onClick={() => navigate("/signup")}
						>
							Sign Up
						</span>
					</div>
				</div>
			</motion.form>
		</div>
	);
};

export default Login;
