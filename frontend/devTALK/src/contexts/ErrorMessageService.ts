import { message } from "antd";

class ErrorMessageService {
	private static instance: ErrorMessageService;

	private constructor() {}

	public static getInstance(): ErrorMessageService {
		if (!ErrorMessageService.instance) {
			ErrorMessageService.instance = new ErrorMessageService();
		}
		return ErrorMessageService.instance;
	}

	public errorMessage(content: string) {
		message.error({
			content,
			className: "font-bold",
			style: {
				marginTop: "1vh",
			},
		});
	}
}

export const errorMessageService = ErrorMessageService.getInstance();
