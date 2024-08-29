import { ConfigProvider, Spin } from "antd";
import React from "react";

interface FullScreenLoadingProps {
	isFullscreenLoading: boolean;
}

const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({
	isFullscreenLoading,
}) => {
	return (
		<ConfigProvider
			theme={{
				components: {
					Spin: {
						dotSizeLG: 128,
					},
				},
			}}
		>
			<Spin
				spinning={isFullscreenLoading}
				size="large"
				fullscreen={true}
			/>
		</ConfigProvider>
	);
};

export default FullScreenLoading;
