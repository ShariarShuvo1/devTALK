import BASE_URL from "./BASE_URL.ts";
import { getJWT } from "./BASE_URL.ts";
import axios from "axios";

export const updateProfilePicture = async (formData: any): Promise<any> => {
	return await axios.post(`${BASE_URL}/user/updateProfilePicture`, formData, {
		headers: {
			Authorization: `Bearer ${getJWT()}`,
			"Content-Type": "multipart/form-data",
		},
		validateStatus: () => true,
	});
};

export const getProfilePicture = async (username: string): Promise<any> => {
	return await axios.get(`${BASE_URL}/user/getProfilePicture/${username}`, {
		validateStatus: () => true,
	});
};
