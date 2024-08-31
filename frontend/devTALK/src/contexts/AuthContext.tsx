import React, {
	createContext,
	useContext,
	ReactNode,
	useState,
	useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
	exp: number;
	sub: string;
	roles: string[];
}

interface AuthContextType {
	isLoggedIn: boolean;
	getRoles: () => string[];
	getUsername: string | null;
	getExpiration: () => number | null;
	getJWT: () => JwtPayload | null;
	getJwtString: () => string | null; // New method
	setJWT: (jwtString: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getJwt(): JwtPayload | null {
	const jwtString = localStorage.getItem("jwt");
	return jwtString ? jwtDecode<JwtPayload>(jwtString) : null;
}

function isJwtExpired(exp: number): boolean {
	return Date.now() >= exp * 1000;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [jwt, setJwtState] = useState<JwtPayload | null>(getJwt());

	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
		const token = getJwt();
		return token !== null && !isJwtExpired(token.exp);
	});
	const [username, setUsername] = useState<string | null>(() => {
		const token = getJwt();
		return token?.sub || null;
	});

	useEffect(() => {
		if (jwt) {
			setIsLoggedIn(!isJwtExpired(jwt.exp));
			setUsername(jwt.sub);
		} else {
			setIsLoggedIn(false);
			setUsername(null);
		}
	}, [jwt]);

	const getRoles = () => {
		return jwt?.roles || [];
	};

	const getExpiration = () => {
		return jwt?.exp || null;
	};

	const getJWT = () => {
		return jwt;
	};

	const getJwtString = () => {
		return localStorage.getItem("jwt");
	};

	const setJWT = (jwtString: string) => {
		const parsedJwt = jwtDecode<JwtPayload>(jwtString);
		localStorage.setItem("jwt", jwtString);
		setJwtState(parsedJwt);
	};

	const logout = () => {
		localStorage.removeItem("jwt");
		setJwtState(null);
		setIsLoggedIn(false);
		setUsername(null);
	};

	const value = {
		isLoggedIn,
		getRoles,
		getUsername: username,
		getExpiration,
		getJWT,
		getJwtString,
		setJWT,
		logout,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
