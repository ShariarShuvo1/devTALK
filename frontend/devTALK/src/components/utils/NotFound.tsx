import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center h-[calc(100vh-3.75rem)] text-white px-4 py-8">
			<motion.div
				className="text-center space-y-6 max-w-md mx-auto"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				<FontAwesomeIcon
					icon={faExclamationTriangle}
					className="text-red-500 text-6xl sm:text-8xl mb-4"
				/>
				<h1 className="text-2xl sm:text-4xl font-bold mb-2">
					404 - Page Not Found
				</h1>
				<p className="text-base sm:text-lg text-gray-400 mb-4">
					Oops! The page you’re looking for doesn’t exist. It might
					have been moved or deleted.
				</p>
			</motion.div>
		</div>
	);
}

export default NotFound;
