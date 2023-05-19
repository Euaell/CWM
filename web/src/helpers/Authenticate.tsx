import { useEffect, useState } from "react";
import { apiEndpoint, ENDPOINTS } from "./api";
import { Navigate, Outlet } from "react-router-dom";

export default function Authenticate() {
	const [verified, setVerified] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		apiEndpoint(ENDPOINTS.users.verify)
			.get()
			.then((response) => {
				return response.data;
			})
			.then(() => {
				setVerified(true)
				setLoading(false)
			})
			.catch(() => {
				setVerified(false)
				setLoading(false)
			});
	})

	if (loading) {
		return (
			<div>
				Loading...
			</div>
		)
	}

	if (verified) {
		return <Outlet />
	}

	return (
		<Navigate to={"/auth/login"} />
	)
}
