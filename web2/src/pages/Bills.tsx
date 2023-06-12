import React, { JSX, useEffect, useState } from "react";
import type { ColumnsType } from 'antd/es/table';
import {Button, DatePicker, InputNumber, message, Pagination, Table, Tag, Typography} from "antd";
import { apiEndpoint, ENDPOINTS } from "../helper/api";
import BillCharts from "../components/BillCharts.tsx";
import dayjs from "dayjs";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

type DataIndex = keyof DataType;

export default function Bills(): JSX.Element {
	const [bill, setBill] = useState([])
	const [selectedMonth, setSelectedMonth] = useState('')
	const [loading, setLoading] = useState(false)
	const [messageApi, contextHolder] = message.useMessage()
	const [rate, setRate] = useState("2")
	const [total, setTotal] = useState(0)
	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(10)

	function fetchBills(dataIndex: DataIndex | null = null, value: string | number | boolean | null = null, startOver = false) {
		messageApi.loading("Loading...")
		setLoading(true)
		apiEndpoint(ENDPOINTS.bills.getBills + `?limit=${limit}&page=${(startOver ? 1 : page)}` + (selectedMonth != '' ? `&selectedMonth=${selectedMonth}` : '') + (dataIndex ? `&${dataIndex}=${value}` : ''))
			.get()
			.then((response) => {
				return response.data;
			})
			.then((data) => {
				console.log(data);
				setBill(data.bills)
				setTotal(data.total)
				messageApi.destroy()
			})
			.catch(error => {
				console.log(error)
				messageApi.error("Something went wrong!")
			})
			.finally(() => {
				setLoading(false)
			})
	}

	function handleMonthChange(_: any, dateString: string) {
		setSelectedMonth(dateString)
	}

	function handleExport() {
		messageApi.info("Exported successfully!")
	}

	function handleGenerateBills() {
		apiEndpoint(ENDPOINTS.bills.createBills)
			.post({ Rate: rate })
			.then((response) => {
				return response.data;
			})
			.then((data) => {
				messageApi.success(data.bills.length + " Bills generated!", 5)
			})
			.catch(error => {
				console.log(error)
				messageApi.error("Something went wrong!")
			})
	}

	useEffect(() => {
		fetchBills()

		return () => {
			setBill([])
		}
	}, [limit, page, selectedMonth])

	const columns : ColumnsType<DataType> = [
		{
			title: "Customer Name",
			dataIndex: "Customer.Name",
			key: "Name",
			render: (_: string, record: any) => record.Customer.Name
		},
		{
			title: "Customer Phone",
			dataIndex: "Customer.Phone",
			key: "Phone",
			render: (_: string, record: any) => record.Customer.Phone
		},
		{
			title: "Total Amount",
			dataIndex: "Amount",
			key: "Amount"
		},
		{
			title: "Due Date",
			dataIndex: "CreatedAt",
			key: "CreatedAt",
			render: (text: string) => dayjs(text).add(2, 'month').format('DD/MM/YYYY')
		},
		{
			title: "Volume",
			dataIndex: "Volume",
			key: "Volume"
		},
		{
			title: "Payment Status",
			dataIndex: "Paid",
			key: "Paid",
			render: (text: boolean) => <Tag color={text ? "green" : "volcano"}>{text ? "Paid" : "Unpaid"}</Tag>
		}
	]

	return (
		<div>
			{contextHolder}
			<div style={{ display: "flex", justifyContent: "space-between", margin: 20 }}>
				<div>
					<Typography.Title style={{ paddingTop: 0, marginTop: 0 }} level={3}>Bills</Typography.Title>
				</div>

				<Button onClick={handleExport} type="primary" danger>Export</Button>
			</div>

			<BillCharts />

			<div style={{ margin: 20 }}>
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<DatePicker
						value={selectedMonth ? dayjs(selectedMonth) : null}
						onChange={handleMonthChange}
						placeholder="Select month"
						picker="month"
						disabledDate={(current: dayjs.Dayjs) => current && current > dayjs().startOf('month')}
					/>
					<div>

					<InputNumber<string>
						value={rate}
						onChange={(value) =>setRate(value ? value : "2")}
						size={"middle"}
						min="1"
						max="100"
						step="0.1"
						style={{ width: 200, margin: 5 }}
						stringMode
					/>
					<Button type="primary" onClick={handleGenerateBills}>Generate this month bills</Button>
				</div>
				</div>

				<Table
					columns={columns}
					loading={loading}
					dataSource={bill}
					rowKey={(record: any) => record._id}
					pagination={false}
					scroll={{ y: 240 }}
				/>

				<Pagination
					style={{ marginTop: 20, float: "right" }}
					current={page}
					total={total}
					pageSize={limit}
					showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
					onChange={(page, pageSize) => {
						setPage(page)
						setLimit(pageSize)
					}}
				/>

			</div>
		</div>
	)
}
