import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header.tsx";

function RoutingPage() {
	return (
		<>
			<Header />
			<div className="bg-black text-white font-sans overflow-auto h-[calc(100vh-3.75rem)] mt-[3.75rem]">
				<Outlet />
			</div>
		</>
	);
}

export default RoutingPage;
