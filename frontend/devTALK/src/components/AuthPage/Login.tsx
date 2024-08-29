import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { successMessageService } from "../../contexts/SuccessMessageService.ts";
import { StatusCodes } from "http-status-codes";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { login } from "../../api/AuthAPI.ts";
import FullScreenLoading from "../utils/FullScreenLoading.tsx";

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
			} else if (response.data) {
				setServerError(response.data);
			} else {
				setServerError("An error occurred during login.");
			}
			setIsFullscreenLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center h-[calc(100vh-3.75rem)] px-4">
			<FullScreenLoading isFullscreenLoading={isFullscreenLoading} />
			<form
				onSubmit={handleSubmit}
				className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
			>
				<h2 className="text-2xl font-bold mb-6 text-white text-center">
					Login
				</h2>

				<div className="mb-4">
					<label
						className="block text-sm font-medium text-gray-300"
						htmlFor="email"
					>
						Email
					</label>
					<input
						id="email"
						name="email"
						value={formData.email}
						onChange={handleInputChange}
						className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:border-indigo-500"
						type="email"
					/>
					{errors.email && (
						<p className="text-red-500 text-xs mt-1">
							{errors.email}
						</p>
					)}
				</div>

				<div className="mb-4">
					<label
						className="block text-sm font-medium text-gray-300"
						htmlFor="password"
					>
						Password
					</label>
					<input
						id="password"
						name="password"
						value={formData.password}
						onChange={handleInputChange}
						className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:border-indigo-500"
						type="password"
					/>
					{errors.password && (
						<p className="text-red-500 text-xs mt-1">
							{errors.password}
						</p>
					)}
				</div>

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

				<div className="mt-4 flex justify-between">
					<div
						className="text-indigo-400 hover:underline cursor-pointer"
						onClick={() => navigate("/forgot-password")}
					>
						Forgot Password?
					</div>
					<div
						className="text-indigo-400 hover:underline cursor-pointer"
						onClick={() => navigate("/signup")}
					>
						Or, Signup
					</div>
				</div>
			</form>
		</div>
	);
};

export default Login;
