import { JSX } from "react";
import { Spin } from "antd";

export default function Loading(): JSX.Element {

	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				background: 'rgba(100, 100, 100, 0.6)',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				zIndex: 9999
			}}
		>
			<Spin size={"large"} />
		</div>
	)
}
