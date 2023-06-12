import { JSX } from "react";
import { Button, Result } from 'antd'

export default function NotFound(): JSX.Element {
	return (
		<Result
			status="404"
			title="404 Not Found"
			subTitle="Sorry, the page you visited does not exist."
			extra={
				<Button type="primary" href="/">
					Back Home
				</Button>
			}
			style={{ width: "100dvw" }}
		/>
	)
}
