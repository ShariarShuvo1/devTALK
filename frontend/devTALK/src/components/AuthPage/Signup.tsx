import React, { useEffect, useState } from "react";
import { checkUsername, register } from "../../api/AuthAPI.ts";
import { successMessageService } from "../../contexts/SuccessMessageService.ts";
import { useNavigate } from "react-router-dom";
import { StatusCodes } from "http-status-codes";
import FullScreenLoading from "../utils/FullScreenLoading.tsx";
import {
	CalendarOutlined,
	EyeInvisibleOutlined,
	EyeTwoTone,
	LockOutlined,
	MailOutlined,
	SignatureOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

interface SignupFormInputs {
	email: string;
	username: string;
	name: string;
	password: string;
	dob: string;
}

const Signup: React.FC = () => {
	const [formData, setFormData] = useState<SignupFormInputs>({
		email: "",
		username: "",
		name: "",
		password: "",
		dob: "",
	});
	const navigate = useNavigate();
	const [isFullscreenLoading, setIsFullscreenLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		const checkUsernameCall = async () => {
			try {
				const response = await checkUsername(formData.username);
				const alreadyExist = response.data;
				if (alreadyExist) {
					setErrors({
						...errors,
						username: "Username already exists",
					});
				} else {
					setErrors({
						...errors,
						username: "",
					});
				}
				setServerError("");
			} catch (error) {
				setServerError("An error occurred during fetching.");
			}
		};

		formData.username && checkUsernameCall();
	}, [formData.username]);

	const [errors, setErrors] = useState<Partial<SignupFormInputs>>({});
	const [serverError, setServerError] = useState<string>("");

	const validateForm = (): boolean => {
		const newErrors: Partial<SignupFormInputs> = {};

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email should be valid";
		}

		if (!formData.username) {
			newErrors.username = "Username is required";
		} else if (
			formData.username.length < 3 ||
			formData.username.length > 20
		) {
			newErrors.username =
				"Username should be between 3 and 20 characters";
		}

		if (!formData.name) {
			newErrors.name = "Name is required";
		} else if (formData.name.length < 3 || formData.name.length > 50) {
			newErrors.name = "Name should be between 3 and 50 characters";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (
			formData.password.length < 6 ||
			formData.password.length > 40
		) {
			newErrors.password =
				"Password should be between 6 and 40 characters";
		}

		if (!formData.dob) {
			newErrors.dob = "Date of Birth is required";
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
			const response = await register(formData);
			if (response.status === StatusCodes.CREATED) {
				successMessageService.successMessage(response.data);
				navigate("/email-sent/" + formData.email);
			} else if (response.data) {
				setServerError(response.data);
			} else {
				setServerError("An error occurred during signup.");
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
					Signup
				</h2>

				<div className="mb-4">
					<div className="flex items-center space-x-2 bg-gray-700 border border-gray-600 rounded">
						<MailOutlined className="text-gray-400 px-3" />
						<input
							id="email"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
							className="w-full py-2 bg-transparent text-white rounded focus:outline-none focus:border-indigo-500"
							type="email"
							placeholder="Email"
						/>
					</div>
					{errors.email && (
						<p className="text-red-500 text-xs mt-1">
							{errors.email}
						</p>
					)}
				</div>

				<div className="mb-4">
					<div className="flex items-center space-x-2 bg-gray-700 border border-gray-600 rounded">
						<SignatureOutlined className="text-gray-400 px-3" />
						<input
							id="username"
							name="username"
							value={formData.username}
							onChange={handleInputChange}
							className="w-full py-2 bg-transparent text-white rounded focus:outline-none focus:border-indigo-500"
							type="text"
							placeholder="Username"
						/>
					</div>
					{errors.username && (
						<p className="text-red-500 text-xs mt-1">
							{errors.username}
						</p>
					)}
				</div>

				<div className="mb-4">
					<div className="flex items-center space-x-2 bg-gray-700 border border-gray-600 rounded">
						<UserOutlined className="text-gray-400 px-3" />
						<input
							id="name"
							name="name"
							value={formData.name}
							onChange={handleInputChange}
							className="w-full py-2 bg-transparent text-white rounded focus:outline-none focus:border-indigo-500"
							type="text"
							placeholder="Name"
						/>
					</div>
					{errors.name && (
						<p className="text-red-500 text-xs mt-1">
							{errors.name}
						</p>
					)}
				</div>

				<div className="mb-4">
					<div className="flex items-center space-x-2 bg-gray-700 border border-gray-600 rounded">
						<LockOutlined className="text-gray-400 px-3" />
						<div className="relative w-full">
							<input
								id="password"
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								className="w-full py-2 bg-transparent text-white rounded focus:outline-none focus:border-indigo-500"
								type={showPassword ? "text" : "password"}
								placeholder="Password"
							/>
							<div
								className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
								onClick={togglePasswordVisibility}
							>
								{showPassword ? (
									<EyeTwoTone className="text-gray-400" />
								) : (
									<EyeInvisibleOutlined className="text-gray-400" />
								)}
							</div>
						</div>
					</div>
					{errors.password && (
						<p className="text-red-500 text-xs mt-1">
							{errors.password}
						</p>
					)}
				</div>

				<div className="mb-4">
					<div className="flex items-center space-x-2 bg-gray-700 border border-gray-600 rounded">
						<CalendarOutlined className="text-gray-400 px-3" />
						<input
							id="dob"
							name="dob"
							value={formData.dob}
							onChange={handleInputChange}
							className="w-full py-2 bg-transparent text-white rounded focus:outline-none focus:border-indigo-500"
							type="date"
						/>
					</div>
					{errors.dob && (
						<p className="text-red-500 text-xs mt-1">
							{errors.dob}
						</p>
					)}
				</div>

				{serverError && (
					<p className="text-red-500 text-center mb-4">
						{serverError}
					</p>
				)}

				<button
					type="submit"
					className="bg-indigo-600 text-white py-2 px-4 rounded w-full hover:bg-indigo-500 transition"
				>
					Signup
				</button>

				<div className="mt-4">
					<div className="text-indigo-400 text-center">
						Already have an account?{" "}
						<span
							className="text-indigo-500 hover:underline cursor-pointer"
							onClick={() => navigate("/login")}
						>
							Login
						</span>
					</div>
				</div>
			</motion.form>
		</div>
	);
};

export default Signup;
