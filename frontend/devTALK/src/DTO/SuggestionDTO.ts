export class SuggestionDTO {
	username: string;
	profilePicture: string;
	name: string;
	connectionSent: boolean;

	constructor(
		username: string,
		profilePicture: string,
		name: string,
		connectionSent: boolean = false,
	) {
		this.username = username;
		this.profilePicture = profilePicture;
		this.name = name;
		this.connectionSent = connectionSent;
	}
}
