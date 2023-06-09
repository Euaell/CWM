import { Typography } from "antd";
import {UsageByCity, UsageYearly, UsersAndRevenueStat} from "../components/DashboardCharts.tsx";

export default function Home(): JSX.Element {

	return (
		<div style={{ padding: 8 }}>
			<Typography.Title level={1} style={{ marginBottom: 0}}>
				Statistics
			</Typography.Title>
			<div>
				{/* Usage by City */}
				<UsageByCity />

				{/* Usage by Year */}
				<UsageYearly />

				<UsersAndRevenueStat />
			</div>
		</div>
	)
}
