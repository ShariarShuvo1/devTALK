export class HeaderDTO {
	profilePicture: string;
	totalPendingConnections: number;

	constructor(
		profilePicture: string = "",
		totalPendingConnections: number = 0,
	) {
		this.profilePicture = profilePicture;
		this.totalPendingConnections = totalPendingConnections;
	}
}
