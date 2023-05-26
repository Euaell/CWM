import { DragEvent, useEffect, useState } from 'react';
import { apiEndpoint, ENDPOINTS } from "../../helper/api";
import {Card, Col, Row, Typography} from "antd";

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

	return (
		<aside style={{ margin: 5}}>
			<div className="description">
				<Typography.Title level={2}>
					You can drag these Devices to the pane above.
				</Typography.Title>
			</div>



			<Row gutter={8} style={{ padding: 3 }}>
				{
					inActiveDevices.map((devices: any) => {
						return (
							<Col span={4} key={devices._id}>
								<Card className="dndnode input"
									  style={{margin: 3 }}
									  title={devices.Label}
									  onDragStart={(event:  DragEvent<HTMLDivElement>) => onDragStart(event, devices._id)}
									  draggable
								>
									<p>{devices.Address}, {devices.City}</p>
								</Card>
							</Col>
						)
					})
				}
			</Row>

		</aside>
	)
}
