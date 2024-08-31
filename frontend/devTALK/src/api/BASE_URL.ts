const BASE_URL: string = "http://localhost:8080";
export default BASE_URL;
export const getJWT = () => {
	return localStorage.getItem("jwt");
};
