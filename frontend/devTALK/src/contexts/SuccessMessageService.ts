import { message } from "antd";

class SuccessMessageService {
	private static instance: SuccessMessageService;

	private constructor() {}

	public static getInstance(): SuccessMessageService {
		if (!SuccessMessageService.instance) {
			SuccessMessageService.instance = new SuccessMessageService();
		}
		return SuccessMessageService.instance;
	}

	public successMessage(content: string) {
		message.success({
			content,
			className: "font-bold",
			style: {
				marginTop: "1vh",
			},
		});
	}
}

export const successMessageService = SuccessMessageService.getInstance();
