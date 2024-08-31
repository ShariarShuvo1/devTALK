import React, { useEffect, useState } from "react";
import { Bars3Icon, BarsArrowUpIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { successMessageService } from "../../contexts/SuccessMessageService.ts";
import { getProfilePicture } from "../../api/UserAPI.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faLink } from "@fortawesome/free-solid-svg-icons";
import { errorMessageService } from "../../contexts/ErrorMessageService.ts";
import { StatusCodes } from "http-status-codes";
import { Tooltip } from "antd";

const Header: React.FC = () => {
	const [open, setOpen] = useState<boolean>(false);
	const navigate = useNavigate();
	const { isLoggedIn, logout, getUsername } = useAuth();
	const [profilePicture, setProfilePicture] = useState<string | null>(null);

	useEffect(() => {
		if (!isLoggedIn) {
			setProfilePicture(null);
		}
		if (isLoggedIn && getUsername && !profilePicture) {
			const fetchProfilePicture = async () => {
				const response = await getProfilePicture(getUsername);
				if (response.status === StatusCodes.OK) {
					setProfilePicture(response.data);
				} else if (response.status === StatusCodes.BAD_REQUEST) {
					errorMessageService.errorMessage(response.data);
				}
			};
			fetchProfilePicture();
		}
	}, [isLoggedIn, getUsername]);

	return (
		<div className="shadow-md w-full fixed top-0 left-0">
			<div className="md:flex items-center justify-between bg-slate-900 py-3 px-7">
				<div className="flex items-center gap-3">
					<span
						className="text-3xl font-bold cursor-pointer select-none text-gray-200 hover:text-gray-300 mr-1"
						onClick={() => navigate("/")}
					>
						devTALK
					</span>
				</div>

				<div
					onClick={() => setOpen(!open)}
					className="text-3xl absolute right-4 top-3 cursor-pointer md:hidden"
				>
					<div className="relative text-gray-200 hover:text-gray-400 h-10 w-10">
						<div
							className={`absolute inset-0 transform transition-transform duration-400 ${
								open
									? "rotate-180 opacity-0"
									: "rotate-0 opacity-100"
							}`}
						>
							<Bars3Icon className="h-10 w-10" />
						</div>
						<div
							className={`absolute inset-0 transform transition-transform duration-400 ${
								open
									? "rotate-0 opacity-100"
									: "rotate-180 opacity-0"
							}`}
						>
							<BarsArrowUpIcon className="h-10 w-10" />
						</div>
					</div>
				</div>

				<ul
					className={`md:flex md:items-center md:pb-0 select-none absolute md:static md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-400 ease-in ${
						open ? "bg-slate-900" : "top-[-490px]"
					}`}
				>
					{!isLoggedIn && (
						<>
							<li
								className="md:ml-8 text-xl md:my-0 my-7 cursor-pointer"
								onClick={() => {
									navigate("/login");
									setOpen(false);
								}}
							>
								<div className="text-gray-200 hover:text-gray-400 duration-500">
									LOGIN
								</div>
							</li>
							<li
								className="md:ml-8 text-xl md:my-0 my-7 cursor-pointer"
								onClick={() => {
									navigate("/signup");
									setOpen(false);
								}}
							>
								<div className="text-gray-200 hover:text-gray-400 duration-500">
									SIGNUP
								</div>
							</li>
						</>
					)}

					{isLoggedIn && getUsername && (
						<>
							<li
								className="md:ml-8 text-xl md:my-0 my-7 cursor-pointer flex items-center text-gray-200 hover:text-gray-400 duration-500 hover:opacity-80"
								onClick={() => {
									navigate("/profile");
									setOpen(false);
								}}
							>
								{profilePicture ? (
									<img
										src={profilePicture}
										alt="Profile"
										className="h-8 w-8 rounded-full object-cover"
									/>
								) : (
									<FontAwesomeIcon
										icon={faUserCircle}
										className="text-3xl"
									/>
								)}
								<div className="ms-2">{getUsername}</div>
							</li>
							<li
								className="md:ml-8 md:my-0 my-7 cursor-pointer flex items-center text-gray-200 hover:text-gray-400 duration-500 hover:opacity-80"
								onClick={() => {
									navigate("/connections");
									setOpen(false);
								}}
							>
								<Tooltip
									title={!open && `Connections`}
									placement="bottom"
									color="geekblue"
								>
									<FontAwesomeIcon
										icon={faLink}
										className="text-2xl"
									/>
								</Tooltip>
								{open && (
									<div className="ms-2 text-xl">
										Connections
									</div>
								)}
							</li>
							<li
								className="md:ml-8 text-xl md:my-0 my-7 cursor-pointer"
								onClick={() => {
									logout();
									setOpen(false);
									navigate("/login");
									successMessageService.successMessage(
										"Logged out successfully",
									);
								}}
							>
								<div className="text-gray-200 hover:text-gray-400 duration-500">
									LOGOUT
								</div>
							</li>
						</>
					)}
				</ul>
			</div>
		</div>
	);
};

export default Header;
