import { Chart as ChartJS, CategoryScale,  LinearScale, BarElement, Title, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import {JSX, useState} from "react";
import {DatePicker} from "antd";

ChartJS.register(ArcElement, Tooltip, Legend, Title, LinearScale, CategoryScale, BarElement);

export default function BillCharts(bills: any): JSX.Element {

	const data = {
		labels: ['Unpaid', 'Paid', 'Overdue'],
		datasets: [
			{
			label: '# of Bills',
			data: [12, 19, 3],
			backgroundColor: [
				'rgba(255, 99, 132, 0.6)',
				'rgba(54, 162, 235, 0.6)',
				'rgba(153, 102, 255, 0.6)'
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(153, 102, 255, 1)'
			],
			borderWidth: 1,
			},
		],
	};

	return (
		<div style={{ display: "flex", justifyContent: "space-between", padding: 8 }}>
			<div style={{ width: "30%", display: "inline-block", margin: 5 }}>
				<Pie data={data} width={80} height={80} />
			</div>

			<div style={{ flexGrow: 1, width: "40%", overflowX: "clip", display: "inline-block", margin: 5 }}>
				<YearlyBarChart />
			</div>
		</div>
	)
}

function YearlyBarChart(): JSX.Element {
	const defaultYear = (new Date()).getFullYear().toString()
	const [selectedYear, setSelectedYear] = useState(defaultYear)

	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top' as const
			},
			title: {
				display: true,
				text: `Yearly Bill Summary for ${selectedYear}`,
			},
		},
	};
	const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	const data = {
		labels: labels,
		datasets: [
			{
				label: 'Unpaid',
				data: [65, 59, 80, 81, 56, 55, 40, 59, 80, 81, 56, 55],
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
				borderColor: 'rgb(255, 99, 132)',
				borderWidth: 1,
			},
			{
				label: 'Paid',
				data: [28, 48, 40, 19, 86, 27, 90, 40, 19, 86, 27, 90],
				backgroundColor: 'rgba(54, 162, 235, 0.5)',
				borderColor: 'rgb(54, 162, 235)',
				borderWidth: 1,
			}
		]
	};

	function handleYearChange(_: any, dateString: string) {
		setSelectedYear(dateString != '' ? dateString : defaultYear)
	}

	return (
		<div>
			<DatePicker
				placeholder="Select year"
				picker="year"
				onChange={handleYearChange}
			/>
			<Bar height={35} width={80}  data={data} options={options} />
		</div>
	)
}
