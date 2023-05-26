import { JSX, useEffect, useState } from "react";
import Loading from "../components/Loading.tsx";
import { Navigate, useNavigate } from "react-router-dom";
import { apiEndpoint, ENDPOINTS } from "./api";
import {useAuth} from "./useAuth.ts";

export default function Logout(): JSX.Element {
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()
	const { resetUser } = useAuth()

	useEffect(() => {
		apiEndpoint(ENDPOINTS.user.logout)
			.get()
			.then(() => {
				resetUser()
				navigate('/')
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	if (loading)
		return <Loading />

	return (
		<Navigate to={'/'} />
	)
}
