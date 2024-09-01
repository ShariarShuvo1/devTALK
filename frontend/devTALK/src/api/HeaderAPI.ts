import BASE_URL from "./BASE_URL.ts";
import { getJWT } from "./BASE_URL.ts";
import axios from "axios";

export const getHeaderInfo = async (): Promise<any> => {
	return await axios.get(`${BASE_URL}/header/getHeaderInfo`, {
		headers: {
			Authorization: `Bearer ${getJWT()}`,
		},
		validateStatus: () => true,
	});
};
