import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RoutingPage from "./routes/RoutingPage.tsx";
import Homepage from "./components/Homepage/Homepage.tsx";

function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <RoutingPage />,
			children: [
				{
					path: "/",
					element: <Homepage />,
				},
			],
		},
	]);

	return <RouterProvider router={router}></RouterProvider>;
}

export default App;
