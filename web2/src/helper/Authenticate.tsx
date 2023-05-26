import { JSX, useEffect, useState } from "react"
import { apiEndpoint, ENDPOINTS } from "./api"
import { Navigate, Outlet } from "react-router-dom"
import Loading from "../components/Loading.tsx";

export default function Authenticate(): JSX.Element {
	const [verified, setVerified] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		apiEndpoint(ENDPOINTS.user.verify)
			.post({})
			.then(() => {
				setVerified(true)
			})
			.catch((error) => {
				console.error(error)
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	if (verified)
		return <Outlet />

	if (loading) {
		return <Loading />
	}

	return (
		<Navigate to={"/auth/login"} />
	)
}
