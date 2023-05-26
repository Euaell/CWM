import React, { JSX, useEffect, useState } from "react";
import { apiEndpoint, ENDPOINTS } from "../../helper/api";
import Loading from "../../components/Loading.tsx";
import {Empty, Form, Layout, Menu} from "antd";
import type { MenuProps } from "antd";
import {Outlet, useNavigate, useOutletContext} from "react-router-dom";
import Flow from "../../components/FlowChart/Flow.tsx";

type MenuItem = Required<MenuProps>['items'][number];

const { Header, Content } = Layout

export default function ShowDevices(): JSX.Element {
	const [devices, setDevices] = useState([])
	const [loading, setLoading] = useState(true)
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
		apiEndpoint(ENDPOINTS.devices.getDevices)
			.get()
			.then((response) => {
				return response.data;
			})
			.then((data) => {
				setDevices(data.devices)
				console.log(data)
			})
			.catch((error) => {
				console.log(error)
			})
			.finally(() => {
				setLoading(false)
			})

		return () => {
			console.log("unmount")
		}
	}, [])

	return (
		<Layout>
			<Header style={{ backgroundColor: "white"}}>
				<Menu theme="light"
					  mode="horizontal"
					  defaultSelectedKeys={["/show-devices"]}
					  items={items}
					  onClick={handleMenuClick}
					  selectedKeys={[window.location.pathname]}
				/>
			</Header>

			<Content style={{ padding: 5 }}>
				{ loading ? <Loading /> : <Outlet context={ { devices } } /> }
			</Content>
		</Layout>
	)
}

export function TableView(): JSX.Element {
	const context: any = useOutletContext()
	const { devices } = context

	console.log(devices)
	return (
		<div>
			Show Devices
		</div>
	)
}

export function ChartView(): JSX.Element {
	const [devices, setDevices]: Array<any> = useState([])
	const [edges, setEdges]: Array<any> = useState([])
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
					return { id: device._id, type: "custom", position: device.Position, data: { label: device.Label, state: device.State }}
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
