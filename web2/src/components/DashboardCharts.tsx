import {JSX, useState} from "react";
import {
	Chart as ChartJS,
	RadialLinearScale,
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Filler,
} from 'chart.js';

import { PolarArea, Line } from 'react-chartjs-2';
import { DatePicker, Typography, Col, Row, Statistic } from "antd";
import CountUp from "react-countup";
import dayjs from "dayjs";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler);

export function UsageByCity(): JSX.Element {
	const data = {
		labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'eminiem', 'logic'],
		datasets: [
			{
				label: '# of Votes',
				data: [19, 19, 3, 5, 2, 3, 7, 8],
				backgroundColor: [
					'rgba(233, 216, 166, 0.5)', 'rgba(238, 155, 0, 0.5)',
					'rgba(0, 27, 45, 0.5)',	'rgba(0, 95, 115, 0.5)',
					'rgba(202, 103, 2, 0.5)', 'rgba(187, 62, 3, 0.5)',
					'rgba(10, 147, 150, 0.5)', 'rgba(148, 210, 189, 0.5)',
					'rgba(174, 32, 18, 0.5)', 'rgba(155, 34, 38, 0.5)'
				],
				borderWidth: 1,
			},
		],
	};

	return (
		<div style={{width: "30%", display: "inline-block", margin: 10}} >
			<Typography.Title level={3}>
				Usage by City
			</Typography.Title>
			<PolarArea data={data} />
		</div>
	)
}

export function UsageYearly(): JSX.Element {
	const defaultYear = (new Date()).getFullYear().toString()
	const [selectedYear, setSelectedYear] = useState(defaultYear)

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top' as const,
			},
			title: {
				display: true,
				text: `Yearly Water Usage for ${selectedYear}`,
			},
		},
	};

	const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	const data = {
		labels: labels,
		datasets: [
			{
				label: 'Water Usage(KL)',
				data: [65, 59, 80, 81, 56, 55, 40, 20, 30, 40, 50, 60],
				fill: true,
				borderColor: 'rgb(53, 162, 235)',
      			backgroundColor: 'rgba(53, 162, 235, 0.5)',
			}
		],
	}

	return (
		<div style={{width: "30%", display: "inline-block", margin: 10}} >
			<Typography.Title level={3}>
				Usage by Year
			</Typography.Title>

			<DatePicker
				defaultValue={dayjs().year(Number(selectedYear)).startOf('year')}
				picker="year"
				onChange={(_, dateString) => setSelectedYear(dateString)}
				disabledDate={(date) => date.year() > dayjs().year()}
			/>
			<Line options={options} data={data} />
		</div>
	)
}

export function UsersAndRevenueStat(): JSX.Element {
	const formatter: any = (value: number) => <CountUp end={value} duration={5} separator="," />;

	return (
		<div style={{width: "30%", display: "inline-block", margin: 10}} >
			<Row gutter={16}>
				<Col span={12}>
					 <Statistic title="Customers" value={312893} formatter={formatter} />
				</Col>
				<Col span={12}>
					<Statistic title="Average Yearly Revenue (Birr)" value={112893} precision={2} formatter={formatter} />
				</Col>
			</Row>
		</div>
	)
}
