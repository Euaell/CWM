import React, { JSX, useEffect, useRef, useState } from "react";
import { apiEndpoint, ENDPOINTS } from "../../helper/api";
import Loading from "../../components/Loading.tsx";
import {Button, Input, InputRef, Layout, Menu, message, Pagination, Popover, QRCode, Space, Table, Tag} from "antd";
import type { MenuProps } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import Flow from "../../components/FlowChart/Flow.tsx";
import { SearchOutlined } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { ColumnsType, ColumnType } from "antd/es/table";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

type DataIndex = keyof DataType;

type MenuItem = Required<MenuProps>['items'][number];

const { Header, Content } = Layout

export default function ShowDevices(): JSX.Element {
	const navigate = useNavigate()

	const items: MenuItem[] = [
		{
			key: "/show-devices",
			label: "Table View"
		},
		{
			key: "/show-devices/chart-view",
			label: "Chart View"
		}
	]

	function handleMenuClick({ key }: { key: React.Key }) {
		navigate(key as string)
	}

	useEffect(() => {
		return () => {
			console.log("unmount")
		}
	}, [])

	return (
		<Layout>
			<Header style={{ backgroundColor: "white" }}>
				<Menu 
					theme="light"
					mode="horizontal"
					defaultSelectedKeys={["/show-devices"]}
					items={items}
					onClick={handleMenuClick}
					selectedKeys={[window.location.pathname]}
				/>
			</Header>

			<Content style={{ padding: 5 }}>
				<Outlet />
			</Content>
		</Layout>
	)
}

export function TableView(): JSX.Element {
	const [devices, setDevices]: Array<any> = useState([])
	const [loading, setLoading] = useState(true)
	const [searchText, setSearchText] = React.useState<string>('');
	const [searchedColumn, setSearchedColumn] = React.useState<DataIndex>();
	const searchInput = useRef<InputRef>(null);
	const [messageApi, contextHolder] = message.useMessage()

	const [page, setPage] = React.useState(1);
	const [limit, setLimit] = React.useState(10);
	const [total, setTotal] = React.useState(0);

	const [isActivated, setIsActivated] = React.useState<string>("");

	function fetchDevices(dataIndex: DataIndex | null = null, value: string | number | boolean | null = null, startOver = false) {
		setLoading(true)

		// fetch data from api every 2 seconds
		const interval = setInterval(() => {
			apiEndpoint(ENDPOINTS.devices.getDevices + `?limit=${limit}&page=${(startOver ? 1 : page)}` + (dataIndex ? `&${dataIndex}=${value}` : '') + (isActivated && (isActivated === 'true' ? `&isActivated=${true}` : `&isActivated=${false}`)))
				.get()
				.then((response) => {
					return response.data
				})
				.then((data) => {
					console.log(data)
					setDevices(data.devices)
					setTotal(data.total)
				})
				.catch(error => {
					console.error(error)
					messageApi.error("Error while fetching devices")
				})
				.finally(() => {
					setLoading(false)
				})
		}, 2000)

		return () => clearInterval(interval)
	}

	function handleSearch(selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
		fetchDevices(dataIndex, selectedKeys[0], true)
	}

	const handleReset = (clearFilters: () => void) => {
		clearFilters();
		setSearchText('');
		setSearchedColumn(undefined);
		fetchDevices()
	};

	function getColumnSearchProps (dataIndex: DataIndex): ColumnType<DataType> {

		return {
			filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
				<div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
					<Input
						ref={searchInput}
						placeholder={`Search ${dataIndex}`}
						value={selectedKeys[0]}
						onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
						onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
						style={{ marginBottom: 8, display: 'block' }}
					/>
					<Space>
						<Button
							type="primary"
							onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
							icon={<SearchOutlined />}
							size="small"
							style={{ width: 90 }}
						>
							Search
						</Button>
						<Button
							onClick={() => clearFilters && handleReset(clearFilters)}
							size="small"
							style={{ width: 90 }}
						>
							Reset
						</Button>
					</Space>
				</div>
			),
			filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
			onFilterDropdownOpenChange: (visible: boolean) => {
				if (visible) {
					setTimeout(() => searchInput.current?.select(), 100);
				}
			},
			render: (text: string) =>
				searchedColumn === dataIndex ? (
					<Highlighter
						highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
						searchWords={[searchText]}
						autoEscape
						textToHighlight={text ? text.toString() : ''}
					/>
				) : (
					text
				),
		};

	}

	function downloadQRCode(_id: string) {
		const canvas = document.getElementById(_id)?.querySelector('canvas') as HTMLCanvasElement
		const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		const downloadLink = document.createElement("a");
		downloadLink.href = pngUrl;
		downloadLink.download = _id + ".png";
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	}

	function handleStatusFilter(value: boolean) {
		console.log(value)
		setIsActivated(value.toString())
	}

	const columns: ColumnsType<DataType> = [
		{
			title: 'Status',
			dataIndex: 'Status',
			key: "Status",
			render: (_, record: any) => (
				<Tag
					color={record.isActivated ? 'green' : 'volcano'}
					key={record._id}
					style={{ width: "50%", textAlign: "center", height: "30px", fontSize: "15px", lineHeight: "30px", fontWeight: 500 }}
				>
					{record.isActivated ? 'Active' : 'Inactive'}
				</Tag>
			),
			filters: [
				{
					text: 'Active',
					value: true,
				},
				{
					text: 'Inactive',
					value: false,
				}
			],
			onFilter: (value: any, record: any) => {
				handleStatusFilter(value)
				return record.isActivated === value
			},
			defaultFilteredValue: ( isActivated === '' ?  [] : (isActivated === 'true' ? [true] : [false])),
			filterMultiple: false
		},
		{
			title: 'City',
			dataIndex: 'City',
			key: "City",
			...getColumnSearchProps('City' as DataIndex)
		},
		{
			title: 'Address',
			dataIndex: 'Address',
			key: "Address",
			...getColumnSearchProps('Address' as DataIndex)
		},
		{
			title: 'Admim',
			dataIndex: 'Admim',
			key: "Admim",
			render: (_, record: any) => (
				<span>{record.Admin.Name}</span>
			)
		},
		{
			title: 'FlowRate',
			dataIndex: 'FlowRate',
			key: "FlowRate",
			sorter: (a: any, b: any) => a.FlowRate - b.FlowRate,
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, record: any) => (
				// render a button for each row that will open a popover with a qr code and a button to download it
				<Popover
					id={record._id}
					content={ <QRCode value={record._id} /> }
					trigger="hover"
				>
					<Button onClick={() => downloadQRCode(record._id)}>
						QR Code
					</Button>
				</Popover>
			),
		}
];

	useEffect(() => {
		setLoading(true)

		const clear = fetchDevices()

		return () => {
			clear()
			setDevices([])
		}
	}, [limit, page, isActivated])

	if (loading) return <Loading />

	return (
		<div>
			{contextHolder}
			<Table
				columns={columns}
				dataSource={devices}
				loading={loading}
				rowKey={(record: any) => record._id}
				pagination={false}
				rowClassName={(record: any) => record._id === "648405e7228c8957d910a9ff" ? 'demo_device' : ''}
			/>

			<Pagination
				style={{ marginTop: 20, marginLeft: "60%" }}
				current={page}
				pageSize={limit}
				total={total}
				showSizeChanger
				showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
				onChange={(page, limit) => {
					setPage(page)
					setLimit(limit)
				}}
			/>
		</div>
	)
}

export function ChartView(): JSX.Element {
	const [devices, setDevices]: Array<any> = useState([])
	const [edges]: Array<any> = useState([])
	const [loading, setLoading] = useState(true)

	const edgeID: Set<string> = new Set()

	useEffect(() => {
		apiEndpoint(ENDPOINTS.devices.getDevices)
			.get()
			.then((response) => {
				return response.data.devices
			})
			.then(async (devices) => {
				await Promise.all(devices.map(async (device: any) => {
					for await (const child of device.Children) {
						const newEdgeID = `${device._id}-${child}`
						if (edgeID.has(newEdgeID)) continue

						edgeID.add(newEdgeID)
						edges.push({ id: newEdgeID, source: device._id, target: child })
					}
				}))

				const tmpDevice = await Promise.all(devices.map(async (device: any) => {
					return { id: device._id, type: "custom", position: device.Position, data: { label: device.FlowRate, state: device.State }}
				}))

				setDevices(tmpDevice)
			})
			.catch(console.error)
			.finally(() => {
				setLoading(false)
			})
	}, [])

	if (loading)
		return <Loading />

	return (
		<Flow InitialNodes={devices} InitialEdges={edges} />
	)
}
