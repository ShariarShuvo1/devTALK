import React, { useEffect, useState } from "react";
import { checkUsername, register } from "../../api/AuthAPI.ts";
import { successMessageService } from "../../contexts/SuccessMessageService.ts";
import { useNavigate } from "react-router-dom";
import { StatusCodes } from "http-status-codes";
import { useAuth } from "../../contexts/AuthContext.tsx";
import FullScreenLoading from "../utils/FullScreenLoading.tsx";

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
	const { setJWT } = useAuth();
	const [isFullscreenLoading, setIsFullscreenLoading] = useState(false);

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
				successMessageService.successMessage("Signup successful");
				setJWT(response.data);
				navigate("/");
			} else if (response.data) {
				setServerError(response.data);
			} else {
				setServerError("An error occurred during signup.");
			}
			setIsFullscreenLoading(false);
		}
	};

	return (
		<div className=" flex items-center justify-center h-[calc(100vh-3.75rem)] px-4">
			<FullScreenLoading isFullscreenLoading={isFullscreenLoading} />
			<form
				onSubmit={handleSubmit}
				className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
			>
				<h2 className="text-2xl font-bold mb-6 text-white text-center">
					Signup
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
						htmlFor="username"
					>
						Username
					</label>
					<input
						id="username"
						name="username"
						value={formData.username}
						onChange={handleInputChange}
						className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:border-indigo-500"
						type="text"
					/>
					{errors.username && (
						<p className="text-red-500 text-xs mt-1">
							{errors.username}
						</p>
					)}
				</div>

				<div className="mb-4">
					<label
						className="block text-sm font-medium text-gray-300"
						htmlFor="name"
					>
						Name
					</label>
					<input
						id="name"
						name="name"
						value={formData.name}
						onChange={handleInputChange}
						className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:border-indigo-500"
						type="text"
					/>
					{errors.name && (
						<p className="text-red-500 text-xs mt-1">
							{errors.name}
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

				<div className="mb-4">
					<label
						className="block text-sm font-medium text-gray-300"
						htmlFor="dob"
					>
						Date of Birth
					</label>
					<input
						id="dob"
						name="dob"
						value={formData.dob}
						onChange={handleInputChange}
						className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:border-indigo-500"
						type="date"
					/>
					{errors.dob && (
						<p className="text-red-500 text-xs mt-1">
							{errors.dob}
						</p>
					)}
				</div>

				<button
					type="submit"
					className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded focus:outline-none focus:bg-indigo-600 transition-colors duration-300"
				>
					Signup
				</button>
				{serverError && (
					<p className="text-red-500 text-center mt-4">
						{serverError}
					</p>
				)}

				<div className="mt-2">
					<div
						className="text-indigo-400 hover:underline cursor-pointer"
						onClick={() => navigate("/login")}
					>
						Or, Log in
					</div>
				</div>
			</form>
		</div>
	);
};

export default Signup;
