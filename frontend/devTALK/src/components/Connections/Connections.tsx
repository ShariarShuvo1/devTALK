import { useEffect, useState } from "react";
import { SuggestionDTO } from "../../DTO/SuggestionDTO.ts";
import FullScreenLoading from "../utils/FullScreenLoading.tsx";
import { getConnectionSuggestion } from "../../api/ConnectionAPI.ts";
import { StatusCodes } from "http-status-codes";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "antd";

function Connections() {
	const [isFullscreenLoading, setIsFullscreenLoading] = useState(false);
	const [suggestions, setSuggestions] = useState<SuggestionDTO[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchSuggestions = async () => {
			setIsFullscreenLoading(true);
			const response = await getConnectionSuggestion();
			if (response.status === StatusCodes.OK) {
				setSuggestions(response.data);
			}
			setIsFullscreenLoading(false);
		};
		fetchSuggestions();
	}, []);

	return (
		<div className="flex h-[calc(100vh-3.75rem)] p-4">
			<FullScreenLoading isFullscreenLoading={isFullscreenLoading} />
			<div className="flex flex-col gap-4">
				{suggestions.map((suggestion) => (
					<div
						key={suggestion.username}
						className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-900 transition-all cursor-pointer hover:text-violet-700"
						onClick={() =>
							navigate(`/profile/${suggestion.username}`)
						}
					>
						{suggestion.profilePicture ? (
							<img
								src={suggestion.profilePicture}
								alt="profile"
								className="h-16 w-16 rounded-full"
							/>
						) : (
							<FontAwesomeIcon
								icon={faUserCircle}
								className="text-6xl"
							/>
						)}

						<div>
							<div className="font-bold">
								<Tooltip
									title={suggestion.name}
									placement="bottom"
									color={"#040126"}
								>
									{suggestion.name
										.split(" ")
										.slice(0, 2)
										.join(" ")}
								</Tooltip>
							</div>
							<div className="text-gray-500">
								{suggestion.username}
							</div>
						</div>
						<button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded">
							Connect
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

export default Connections;
