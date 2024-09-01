import { useEffect, useState } from "react";
import FullScreenLoading from "../utils/FullScreenLoading.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUserPlus,
	faUserFriends,
	faUserClock,
	faUserEdit,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import ConnectionBody from "./ConnectionBody.tsx";

function Connections() {
	const [isFullscreenLoading, _setIsFullscreenLoading] = useState(false);
	const navigate = useNavigate();
	const { name } = useParams();
	const [currentlySelected, setCurrentlySelected] = useState<string>(
		name || "my-connections",
	);

	useEffect(() => {
		if (!name) {
			navigate("/connections/my-connections");
		}
		setCurrentlySelected(name || "my-connections");
	}, [name]);

	const toolbarItems = [
		{
			label: "My Connections",
			icon: faUserFriends,
			path: "my-connections",
		},
		{ label: "Suggestions", icon: faUserPlus, path: "suggestions" },
		{ label: "Requests", icon: faUserClock, path: "requests" },
		{ label: "Sent", icon: faUserEdit, path: "sent" },
	];

	return (
		<div className="flex flex-col md:flex-row h-[calc(100vh-3.75rem)]">
			<FullScreenLoading isFullscreenLoading={isFullscreenLoading} />
			<div className="select-none md:max-w-56 md:h-full w-full md:w-auto fixed md:relative bottom-0 md:bottom-auto bg-slate-800 text-xl font-semibold text-white p-2 flex md:flex-col justify-between md:justify-normal gap-2">
				{toolbarItems.map((item) => (
					<div
						key={item.path}
						className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer transition duration-300 ${
							currentlySelected === item.path
								? "bg-slate-950"
								: "md:hover:bg-gray-700"
						}`}
						onClick={() => navigate(`/connections/${item.path}`)}
					>
						<FontAwesomeIcon icon={item.icon} />
						<div className="hidden text-sm md:text-xl sm:block">
							{item.label}
						</div>
					</div>
				))}
			</div>
			<ConnectionBody currentlySelected={currentlySelected} />
		</div>
	);
}

export default Connections;
