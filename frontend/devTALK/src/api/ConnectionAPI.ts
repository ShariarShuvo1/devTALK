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

export const deleteSentConnection = async (
	requesterUsername: string,
): Promise<any> => {
	return await axios.delete(
		`${BASE_URL}/connection/deleteSentConnection/${requesterUsername}`,
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

export const getMyConnections = async (page: number): Promise<any> => {
	return await axios.get(`${BASE_URL}/connection/myConnections/${page}`, {
		headers: {
			Authorization: `Bearer ${getJWT()}`,
		},
		validateStatus: () => true,
	});
};

export const getPendingRequests = async (page: number): Promise<any> => {
	return await axios.get(`${BASE_URL}/connection/pendingRequests/${page}`, {
		headers: {
			Authorization: `Bearer ${getJWT()}`,
		},
		validateStatus: () => true,
	});
};

export const getSentRequests = async (page: number): Promise<any> => {
	return await axios.get(`${BASE_URL}/connection/sentRequests/${page}`, {
		headers: {
			Authorization: `Bearer ${getJWT()}`,
		},
		validateStatus: () => true,
	});
};
