export class SuggestionDTO {
	username: string;
	profilePicture: string;
	name: string;

	constructor(username: string, profilePicture: string, name: string) {
		this.username = username;
		this.profilePicture = profilePicture;
		this.name = name;
	}
}
