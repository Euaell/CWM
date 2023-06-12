import { JSX, useEffect, useState } from "react";
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
import { apiEndpoint, ENDPOINTS } from "../helper/api";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler);

export function UsageByCity(): JSX.Element {
	const [usageData, setUsageData] = useState<Array<number>>([])
	const [cityData, setCityData] = useState<Array<string>>([])

	console.log(usageData, cityData)
	useEffect(() => {
		apiEndpoint(ENDPOINTS.user.getCitiesAndUsages)
			.get()
			.then((response) => {
				return response.data
			})
			.then((data) => {
				console.log(data)
				setCityData(data.cities)
				setUsageData(data.usages)
			})
			.catch((error) => {
				console.error(error)
			})
	}, [])

	const data = {
		// labels: cityData,
		labels: [ 'Dire Dawa', 'Mekelle', 'Gondar', 'Adama', 'Bahir Dar', 'Awasa', 'Jimma', 'Debre Markos', 'Kombolcha', 'Addis Ababa' ],
		datasets: [
			{
				label: 'Water Usage(KL)',
				// data: usageData,
				data: [940, 740, 800, 500, 600, 700, 520, 400, 450, 1080],
				backgroundColor: [
					'rgba(10, 147, 150, 0.5)', 'rgba(174, 32, 18, 0.5)',
					'rgba(0, 27, 45, 0.5)',	'rgba(0, 95, 115, 0.5)',
					'rgba(202, 103, 2, 0.5)', 'rgba(187, 62, 3, 0.5)',
					'rgba(238, 155, 0, 0.5)', 'rgba(148, 210, 189, 0.5)',
					'rgba(233, 216, 166, 0.5)', 'rgba(155, 34, 38, 0.5)'
				],
				borderWidth: 1,
			},
		],
	};

	return (
		<div style={{width: "45%", display: "inline-block", margin: 10}} >
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
	const [usageData, setUsageData] = useState<Array<number>>([])

	function fetchData() {
		apiEndpoint(ENDPOINTS.bills.getUsageDataByYear + `?year=${selectedYear}`)
			.get()
			.then((response) => {
				return response.data
			})
			.then((data) => {
				setUsageData(data.usage)
			})
			.catch((error) => {
				console.error(error)
			})
	}

	useEffect(() => {
		fetchData()

		return () => {
			setUsageData([])
		}
	}, [selectedYear])

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
				// data: [65, 59, 80, 81, 56, 55, 40, 20, 30, 40, 50, 60],
				data: usageData,
				fill: true,
				borderColor: 'rgb(53, 162, 235)',
				backgroundColor: 'rgba(53, 162, 235, 0.5)',
			}
		],
	}

	function handleYearChange(_: any, dateString: string) {
		setSelectedYear(dateString != '' ? dateString : defaultYear)
	}

	return (
		<div style={{width: "45%", display: "inline-block", margin: 10}} >
			<Typography.Title level={3}>
				Usage by Year
			</Typography.Title>

			<DatePicker
				picker="year"
				onChange={handleYearChange}
				disabledDate={(date) => date.year() > dayjs().year()}
			/>
			<Line options={options} data={data} />
		</div>
	)
}

export function UsersAndRevenueStat(): JSX.Element {
	const [customers, setCustomers] = useState<number>(0)
	const [revenue, setRevenue] = useState<number>(0)

	useEffect(() => {
		apiEndpoint(ENDPOINTS.customers.getCustomerAverage)
			.get()
			.then((response) => {
				return response.data
			})
			.then((data) => {
				setCustomers(data.customers)
				setRevenue(data.average)
			})
			.catch((error) => {
				console.error(error)
			})
	}, [])

	const formatter: any = (value: number) => <CountUp end={value} duration={5} separator="," />;

	return (
		<div style={{width: "40%", display: "inline-block", margin: 10, marginLeft: 20}} >
			<Row gutter={16}>
				<Col span={12}>
					<Statistic title="Customers" value={customers} formatter={formatter} />
				</Col>
				<Col span={12}>
					<Statistic title="Average Yearly Revenue (Birr)" value={revenue} precision={2} formatter={formatter} />
				</Col>
			</Row>
		</div>
	)
}
