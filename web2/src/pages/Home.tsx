import { Button, Result, Typography } from "antd";
import { UsageByCity, UsageYearly, UsersAndRevenueStat } from "../components/DashboardCharts.tsx";
import { JSX } from "react"
import { useAuth } from "../helper/useAuth.ts";
import { useNavigate } from "react-router-dom";

export default function Home(): JSX.Element {
	const { user } = useAuth();
	const navigate = useNavigate();

	if (!user.token) {
		return (
			<Result
				title="Login to view statistics"
				extra={
					<Button type="primary" key="console" onClick={() => navigate('auth/login')}>
						Goto Login
					</Button>
				}
			/>
		)
	}

	return (
			<div style={{padding: 8}}>
				<Typography.Title level={1} style={{marginBottom: 0}}>
					Statistics
				</Typography.Title>

				<UsersAndRevenueStat/>

				<div>
					{/* Usage by City */}
					<UsageByCity/>

					{/* Usage by Year */}
					<UsageYearly/>

				</div>
			</div>
	)
}
