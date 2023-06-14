import { memo, useState } from "react"

import { Handle, Position, NodeToolbar } from "reactflow"
import { Button, message, Popover, QRCode } from "antd";
import { apiEndpoint, ENDPOINTS } from "../../helper/api";

const CustomNode = memo((props: any) => {
	const [data, setData] = useState(props.data)

	function handleClicked() {
		apiEndpoint(ENDPOINTS.devices.getDeviceByID)
			.get(props.id)
			.then((response) => {
				return response.data.device
			})
			.then((device) => {
				setData({ ...data, label: device.FlowRate, state: device.State })
			})
			.catch((error) => {
				console.log(error)
				message.destroy()
				message.error("Something Went Wrong!")
			})
	}

	function handleQRCode() {
		const canvas = document.getElementById(props.id)?.querySelector('canvas') as HTMLCanvasElement
		const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
		const downloadLink = document.createElement("a");
		downloadLink.href = pngUrl;
		downloadLink.download = props.id + ".png";
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	}

	function handleState() {
		const payload = data.state === 'open' ? 'close' : 'open'
		apiEndpoint(ENDPOINTS.devices.updateDevice)
			.put(props.id, { State: payload })
			.then((response) => {
				console.log(response.data)
				setData({ ...data, state: payload })
			})
			.catch((error) => {
				console.log(error)
				message.error("Something Went Wrong!")
			})
	}
	return (
		<div
			style={{ backgroundColor: "lightblue", borderRadius: 8, padding: 10, width: 70 }}
			onMouseOver={() => setData({...data, toolbarVisible: true})}
			onMouseLeave={() => setData({...data, toolbarVisible: false})}
			onClick={handleClicked}
		>
			<NodeToolbar
				isVisible={data.toolbarVisible}
				position={data.toolbarPosition}
				offset={1}
				nodeId={props.id}
			>
				<Popover
					id={props.id}
					content={<QRCode value={props.id} />}
					trigger="hover"
				>
					<Button onClick={() => handleQRCode()}>
						QR Code
					</Button>
				</Popover>
				<Button onClick={handleState}>{data.state}</Button>
			</NodeToolbar>
			<Handle type="target" position={Position.Top} />
			<div style={{ padding: 10, backgroundColor: "red", borderRadius: 5, textAlign: "center" }}>
				{data.label}
			</div>
			<Handle type="source" position={Position.Bottom} />
		</div>
	)
})

export default CustomNode
