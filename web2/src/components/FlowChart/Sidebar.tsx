import { DragEvent, useEffect, useState } from 'react';
import { apiEndpoint, ENDPOINTS } from "../../helper/api";
import {Card, Col, Empty, Row, Typography} from "antd";

export default function Sidebar(): JSX.Element {
	const [inActiveDevices, setInActiveDevices]: Array<any> = useState([])

	useEffect(() => {
		apiEndpoint(ENDPOINTS.devices.getDevices + "?isActivated=false")
			.get()
			.then((response) => {
				setInActiveDevices(response.data.devices)
				console.log(response.data)
			})
			.catch((error) => {
				console.log(error)
			})
	}, [])
	const onDragStart = (event: React.DragEvent<HTMLDivElement>, id: string) => {
		event.dataTransfer.setData('application/reactflow', id);
		event.dataTransfer.effectAllowed = 'move';
	}

	const onDragEnd = (event: React.DragEvent<HTMLDivElement>, id: string) => {
		// console.table({x: event.clientX, y: event.clientY, screenX: event.screenX, screenY: event.screenY, pageX: event.pageX, pageY: event.pageY})
		// remove the device from inactive de-vices
		if (event.pageX < 1217 && event.pageX > 263 && event.pageY > 138 && event.pageY < 698) {
			setInActiveDevices(inActiveDevices.filter((device: any) => device._id !== id))
		}
	}

	return (
		<aside style={{ margin: 5}}>
			<div className="description">
				<Typography.Title level={2}>
					You can drag these Devices to the pane above.
				</Typography.Title>
			</div>

			<Row gutter={8} style={{ padding: 3 }}>
				{
					inActiveDevices.length > 0 ?
					inActiveDevices.map((devices: any) => {
						return (
							<Col span={4} key={devices._id}>
								<Card className="dndnode input"
									  style={{margin: 3 }}
									  title={devices.Label}
									  onDragStart={(event:  DragEvent<HTMLDivElement>) => onDragStart(event, devices._id)}
									  onDragEnd={(event:  DragEvent<HTMLDivElement>) => onDragEnd(event, devices._id)}
									  draggable
								>
									<p>{devices.Address}, {devices.City}</p>
								</Card>
							</Col>
						)
					})
						:
					<Empty description="No devices found" />
				}
			</Row>

		</aside>
	)
}
