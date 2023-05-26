import { Layout, Typography } from "antd"
import { JSX } from "react";
import {NavigateFunction, Outlet, useNavigate} from "react-router-dom";

const { Header, Content } = Layout
const { Title } = Typography

export default function AuthLayout(): JSX.Element {
	const navigate: NavigateFunction = useNavigate()

	function handleTitle() {
		navigate('/')
	}

	return (
		<Layout style={{ minHeight: "100dvh", minWidth: "100dvw", display: "flex", alignItems: "center", backgroundColor: "white" }}>
			<Header style={{ display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
				<Title onClick={handleTitle} style={{ cursor: "pointer" }}>CWM</Title>
			</Header>
			<Content  style={{ padding: "3rem", backgroundColor: "white" }}>
				<Outlet />
			</Content>
		</Layout>
	)
}