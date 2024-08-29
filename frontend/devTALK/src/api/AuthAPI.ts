import BASE_URL from "./BASE_URL.ts";
import axios from "axios";

export const checkUsername = async (username: string): Promise<any> => {
	return await axios.get(`${BASE_URL}/checkUsername/${username}`, {
		validateStatus: () => true,
	});
};

export const register = async (body: any): Promise<any> => {
	return await axios.post(`${BASE_URL}/register`, body, {
		validateStatus: () => true,
	});
};

export const login = async (body: any): Promise<any> => {
	return await axios.post(`${BASE_URL}/login`, body, {
		validateStatus: () => true,
	});
};
