import BASE_URL from "./BASE_URL.ts";
import { getJWT } from "./BASE_URL.ts";
import axios from "axios";

export const getConnectionSuggestion = async (page: number): Promise<any> => {
	return await axios.get(`${BASE_URL}/connection/suggestion/${page}`, {
		headers: {
			Authorization: `Bearer ${getJWT()}`,
		},
		validateStatus: () => true,
	});
};

export const newConnection = async (
	recipientUsername: string,
): Promise<any> => {
	return await axios.get(
		`${BASE_URL}/connection/newConnection/${recipientUsername}`,
		{
			headers: {
				Authorization: `Bearer ${getJWT()}`,
			},
			validateStatus: () => true,
		},
	);
};

export const acceptConnection = async (
	requesterUsername: string,
): Promise<any> => {
	return await axios.get(
		`${BASE_URL}/connection/acceptConnection/${requesterUsername}`,
		{
			headers: {
				Authorization: `Bearer ${getJWT()}`,
			},
			validateStatus: () => true,
		},
	);
};

export const rejectConnection = async (
	requesterUsername: string,
): Promise<any> => {
	return await axios.get(
		`${BASE_URL}/connection/rejectConnection/${requesterUsername}`,
		{
			headers: {
				Authorization: `Bearer ${getJWT()}`,
			},
			validateStatus: () => true,
		},
	);
};

export const blockConnection = async (
	requesterUsername: string,
): Promise<any> => {
	return await axios.get(
		`${BASE_URL}/connection/blockConnection/${requesterUsername}`,
		{
			headers: {
				Authorization: `Bearer ${getJWT()}`,
			},
			validateStatus: () => true,
		},
	);
};

export const getMyConnections = async (): Promise<any> => {
	return await axios.get(`${BASE_URL}/connection/myConnections`, {
		headers: {
			Authorization: `Bearer ${getJWT()}`,
		},
		validateStatus: () => true,
	});
};

export const getPendingRequests = async (): Promise<any> => {
	return await axios.get(`${BASE_URL}/connection/pendingRequests`, {
		headers: {
			Authorization: `Bearer ${getJWT()}`,
		},
		validateStatus: () => true,
	});
};

export const getSentRequests = async (): Promise<any> => {
	return await axios.get(`${BASE_URL}/connection/sentRequests`, {
		headers: {
			Authorization: `Bearer ${getJWT()}`,
		},
		validateStatus: () => true,
	});
};
