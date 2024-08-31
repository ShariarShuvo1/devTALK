import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import { successMessageService } from "../../contexts/SuccessMessageService.ts";
import { errorMessageService } from "../../contexts/ErrorMessageService.ts";
import { updateProfilePicture } from "../../api/UserAPI.ts";
import { StatusCodes } from "http-status-codes";
import FullScreenLoading from "../utils/FullScreenLoading.tsx";

function ProfilePictureSetup() {
	const navigate = useNavigate();
	const [image, setImage] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [isFullscreenLoading, setIsFullscreenLoading] = useState(false);

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setImage(file);
			setPreview(URL.createObjectURL(file));
		}
	};

	const handleUpload = async () => {
		if (!image) return;

		const formData = new FormData();
		formData.append("profilePicture", image);
		setIsFullscreenLoading(true);
		const response = await updateProfilePicture(formData);
		if (response.status === StatusCodes.OK) {
			successMessageService.successMessage(response.data);
			navigate("/");
		} else {
			errorMessageService.errorMessage(response.data);
		}
		setIsFullscreenLoading(false);
	};

	return (
		<div className="flex items-center justify-center h-[calc(100vh-3.75rem)] bg-black text-white relative">
			<FullScreenLoading isFullscreenLoading={isFullscreenLoading} />
			<motion.div
				className="absolute top-6 right-6 cursor-pointer"
				whileHover={{ scale: 1.2 }}
				onClick={() => navigate("/")}
			>
				<CloseOutlined className="text-3xl text-gray-500 hover:text-white" />
			</motion.div>

			<div className="w-full max-w-md p-6 py-16 bg-gray-800 rounded-lg mx-4 shadow-lg">
				<div className="flex flex-col items-center space-y-12">
					<motion.label
						className="relative rounded-full bg-gray-700 flex items-center justify-center cursor-pointer overflow-hidden shadow-2xl transition-all duration-300 ease-in-out"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						style={{
							width: preview ? "16rem" : "12rem",
							height: preview ? "16rem" : "12rem",
							transition: "width 0.3s ease, height 0.3s ease",
						}}
					>
						{preview ? (
							<img
								src={preview}
								alt="Profile Preview"
								className="w-full h-full object-cover rounded-full"
							/>
						) : (
							<div className="relative flex items-center justify-center w-full h-full">
								<FontAwesomeIcon
									icon={faUserTie}
									className="text-6xl text-gray-400 absolute"
								/>
							</div>
						)}
						<input
							type="file"
							className="absolute inset-0 opacity-0 cursor-pointer"
							accept="image/*"
							onChange={handleImageUpload}
						/>
						{!preview && (
							<motion.div
								className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0"
								whileHover={{ opacity: 1 }}
							>
								<UploadOutlined className="text-4xl text-white" />
							</motion.div>
						)}
					</motion.label>

					{!preview && (
						<p className="text-gray-400 text-center text-sm">
							No file chosen. <br />
							<span className="text-2xl">
								Upload your profile picture
							</span>
						</p>
					)}

					{preview && (
						<motion.button
							className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg hover:shadow-xl focus:outline-none transform transition-all duration-300 ease-in-out"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleUpload}
						>
							<UploadOutlined className="mr-2" />
							Confirm Upload
						</motion.button>
					)}
				</div>
			</div>
		</div>
	);
}

export default ProfilePictureSetup;
