import { JSX } from "react";
import { Outlet } from "react-router-dom";

export default function RootLayout(): JSX.Element {

	return (
		<div>
			Root Layout
			<Outlet />
		</div>
	)
}