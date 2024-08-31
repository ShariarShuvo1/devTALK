import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RoutingPage from "./routes/RoutingPage";
import Homepage from "./components/Homepage/Homepage.tsx";
import { useAuth } from "./contexts/AuthContext";
import "./app.css";
import Signup from "./components/AuthPage/Signup.tsx";
import Login from "./components/AuthPage/Login.tsx";
import EmailSentPage from "./components/AuthPage/EmailSentPage.tsx";
import NotFound from "./components/utils/NotFound.tsx";
import VerifyEmail from "./components/AuthPage/VerifyEmail.tsx";
import ForgotPassword from "./components/AuthPage/ForgotPassword.tsx";
import ResetPassword from "./components/AuthPage/ResetPassword.tsx";
import ProfilePictureSetup from "./components/AuthPage/ProfilePictureSetup.tsx";

function App() {
	const { isLoggedIn } = useAuth();
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
					element: !isLoggedIn ? <Signup /> : <Homepage />,
				},
				{
					path: "/login",
					element: !isLoggedIn ? <Login /> : <Homepage />,
				},
				{
					path: "/email-sent/:email",
					element: !isLoggedIn ? <EmailSentPage /> : <Homepage />,
				},
				{
					path: "/VerifyEmail/:token",
					element: !isLoggedIn ? <VerifyEmail /> : <Homepage />,
				},
				{
					path: "/updateProfilePicture",
					element: isLoggedIn ? (
						<ProfilePictureSetup />
					) : (
						<Homepage />
					),
				},
				{
					path: "/resetPassword/:token",
					element: !isLoggedIn ? <ResetPassword /> : <Homepage />,
				},
				{
					path: "/forgot-password",
					element: !isLoggedIn ? <ForgotPassword /> : <Homepage />,
				},
				{
					path: "*",
					element: <NotFound />,
				},
			],
		},
	]);

	return <RouterProvider router={router} />;
}

export default App;
