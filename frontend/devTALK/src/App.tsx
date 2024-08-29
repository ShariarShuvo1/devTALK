import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RoutingPage from "./routes/RoutingPage";
import Homepage from "./components/Homepage/Homepage.tsx";
import { AuthProvider } from "./contexts/AuthContext";
import "./app.css";
import Signup from "./components/AuthPage/Signup.tsx";
import Login from "./components/AuthPage/Login.tsx";

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
				{
					path: "/signup",
					element: <Signup />,
				},
				{
					path: "/login",
					element: <Login />,
				},
			],
		},
	]);

	return (
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	);
}

export default App;
