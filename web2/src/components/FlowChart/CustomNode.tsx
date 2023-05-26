import { memo, useState } from "react"

import { Handle, Position, NodeToolbar } from "reactflow"
import {Button, message} from "antd";
import {apiEndpoint, ENDPOINTS} from "../../helper/api";

const CustomNode = memo((props: any) => {
	const [data, setData] = useState(props.data)

	function handleQRCode() {
		console.log("Generate QR Code: ", props.id)
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
		<div style={{ backgroundColor: "lightblue", borderRadius: 8, padding: 10 }}
			 onMouseOver={() => setData({...data, toolbarVisible: true})}
			 onMouseLeave={() => setData({...data, toolbarVisible: false})}
		>
			<NodeToolbar
				isVisible={data.toolbarVisible}
				position={data.toolbarPosition}
				offset={1}
				nodeId={props.id}
			>
				<Button onClick={handleQRCode}>QR Code</Button>
				<Button onClick={handleState}>{data.state}</Button>
			</NodeToolbar>
			<Handle type="target" position={Position.Top} />
			<div style={{ padding: 10 }}>
				{data.label}
			</div>
			<Handle type="source" position={Position.Bottom} />
		</div>
	)
})

export default CustomNode
