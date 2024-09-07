import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUser,
	faRemove,
	faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { SuggestionDTO } from "../../../DTO/SuggestionDTO.ts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { deleteSentConnection } from "../../../api/ConnectionAPI.ts";
import { StatusCodes } from "http-status-codes";
import { errorMessageService } from "../../../contexts/ErrorMessageService.ts";

interface RequestCardProps {
	request: SuggestionDTO;
}

export default function SentCard({ request }: RequestCardProps) {
	const navigate = useNavigate();
	const [hasDeleted, setHasDeleted] = useState<boolean>(false);

	const deleteRequest = async () => {
		const response = await deleteSentConnection(request.username);
		if (response.status === StatusCodes.OK) {
			setHasDeleted(true);
		} else {
			errorMessageService.errorMessage(response.data);
		}
	};

	return (
		<motion.div
			className="bg-gray-800 rounded-lg overflow-hidden flex flex-col"
			whileHover={{ scale: 1.02 }}
			transition={{ duration: 0.3 }}
		>
			<div
				className="relative cursor-pointer"
				onClick={() => navigate(`/profile/${request.username}`)}
			>
				{request.profilePicture && (
					<img
						src={request.profilePicture || ""}
						alt={request.name}
						className={`w-full h-64 object-cover`}
					/>
				)}
				{!request.profilePicture && (
					<div className="w-full h-64 bg-gray-700 relative">
						<FontAwesomeIcon
							icon={faUser}
							className="text-gray-500 text-5xl absolute inset-0 m-auto "
						/>
					</div>
				)}
			</div>
			<div className="p-4 flex-grow">
				<h2
					className="text-lg font-semibold cursor-pointer hover:underline"
					onClick={() => navigate(`/profile/${request.username}`)}
				>
					{request.name}
				</h2>
				<p className="text-gray-400">@{request.username}</p>
			</div>
			{hasDeleted ? (
				<div className="py-2 px-4 text-center bg-green-600 text-black font-semibold select-none">
					<FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
					Request Deleted
				</div>
			) : (
				<button
					className="mt-auto bg-red-800 text-black font-semibold py-2 px-4 w-full hover:bg-red-900 transition-colors"
					onClick={() => deleteRequest()}
				>
					<FontAwesomeIcon icon={faRemove} className="mr-2" />
					Delete Request
				</button>
			)}
		</motion.div>
	);
}
