import React, { createContext, useContext, ReactNode, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
	exp: number;
	username: string;
	roles: string[];
}

interface AuthContextType {
	isLoggedIn: () => boolean;
	getRoles: () => string[];
	getUsername: () => string | null;
	getExpiration: () => number | null;
	getJWT: () => JwtPayload | null;
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

	const isLoggedIn = () => {
		return jwt !== null && !isJwtExpired(jwt.exp);
	};

	const getRoles = () => {
		return jwt?.roles || [];
	};

	const getUsername = () => {
		return jwt?.username || null;
	};

	const getExpiration = () => {
		return jwt?.exp || null;
	};

	const getJWT = () => {
		return jwt;
	};

	const setJWT = (jwtString: string) => {
		const parsedJwt = jwtDecode<JwtPayload>(jwtString);
		localStorage.setItem("jwt", jwtString);
		setJwtState(parsedJwt);
	};

	const logout = () => {
		localStorage.removeItem("jwt");
		setJwtState(null);
	};

	const value = {
		isLoggedIn,
		getRoles,
		getUsername,
		getExpiration,
		getJWT,
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
