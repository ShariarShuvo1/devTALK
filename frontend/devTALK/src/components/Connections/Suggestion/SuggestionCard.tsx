import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUser,
	faPlus,
	faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { SuggestionDTO } from "../../../DTO/SuggestionDTO.ts";
import { useNavigate } from "react-router-dom";

interface SuggestionCardProps {
	suggestion: SuggestionDTO;
	onConnect: (username: string, index: number) => void;
	index: number;
}

export default function SuggestionCard({
	suggestion,
	onConnect,
	index,
}: SuggestionCardProps) {
	const navigate = useNavigate();
	return (
		<motion.div
			className="bg-gray-800 rounded-lg overflow-hidden flex flex-col"
			whileHover={{ scale: 1.02 }}
			transition={{ duration: 0.3 }}
		>
			<div
				className="relative cursor-pointer"
				onClick={() => navigate(`/profile/${suggestion.username}`)}
			>
				{suggestion.profilePicture && (
					<img
						src={suggestion.profilePicture || ""}
						alt={suggestion.name}
						className={`w-full h-64 object-cover`}
					/>
				)}
				{!suggestion.profilePicture && (
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
					onClick={() => navigate(`/profile/${suggestion.username}`)}
				>
					{suggestion.name}
				</h2>
				<p className="text-gray-400">@{suggestion.username}</p>
			</div>
			{suggestion.connectionSent ? (
				<div className="py-2 px-4 text-center bg-green-600 text-black font-semibold select-none">
					<FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
					Request Sent
				</div>
			) : (
				<button
					className="mt-auto bg-blue-500 text-black font-semibold py-2 px-4 w-full hover:bg-blue-600 transition-colors"
					onClick={() => onConnect(suggestion.username, index)}
				>
					<FontAwesomeIcon icon={faPlus} className="mr-2" />
					Connect
				</button>
			)}
		</motion.div>
	);
}
