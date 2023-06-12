import ReactFlow, {
	MiniMap,
	Background,
	BackgroundVariant,
	Controls,
	useNodesState,
	useEdgesState,
	addEdge,
	ReactFlowProvider
} from 'reactflow'
import 'reactflow/dist/style.css' // necessary for default styles and to make it work

import { useCallback, useRef, useState } from "react"
import CustomNode from "./CustomNode.tsx"
import Sidebar from "./Sidebar.tsx"
import { apiEndpoint, ENDPOINTS } from "../../helper/api";
import { Button, message } from "antd";

const nodeTypes = {
	custom: CustomNode
}

export default function Flow({ InitialNodes, InitialEdges }: { InitialNodes: Array<any>, InitialEdges: Array<any> }) {
	const reactFlowWrapper = useRef(null);
	const [nodes, setNodes, onNodesChange] = useNodesState(InitialNodes)
	const [edges, setEdges, onEdgesChange] = useEdgesState(InitialEdges)

	const [showMiniMap, setShowMiniMap] = useState(false)

	const [reactFlowInstance, setReactFlowInstance] = useState(null);

	const onConnect = useCallback(async (params: any) => {
		await apiEndpoint(ENDPOINTS.devices.addChildren + `?parent=${params.source}&child=${params.target}`).put("", {})

		setEdges((es) => {
				setEdges((es) => addEdge({...params, id: `${params.source}->${params.target}`}, es))
				return es.concat({...params, id: `${params.source}->${params.target}`})
			});
	}, [setEdges])

	const onDragOver = useCallback((event: any) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}, [])

	const handleNodeDragStop = useCallback((_: any, node: any) => {
		const id = node.id
		const Position = node.position
		apiEndpoint(ENDPOINTS.devices.updateDevice)
			.put(id, { Position })
			.then((response) => {
				return response.data.device
			})
			.then((device) => {
				const newDevice = {
					id: device._id,
					type: "custom",
					position: device.Position,
					data: { label: device.Label}
				}
				setNodes((ns) => ns.concat(newDevice))
			})
			.catch((error) => {
				console.error(error)
				message.error("Something went wrong!")
			})
	}, [])

	const onDrop = useCallback((event: any) => {
			event.preventDefault();
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
			const id = event.dataTransfer.getData('application/reactflow');

			if (typeof id === 'undefined' || !id) return;

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			})

			// add device call
			apiEndpoint(ENDPOINTS.devices.updateDevice)
				.put(id, {
					Position: position
				})
				.then((response) => {
					return response.data.device
				})
				.then((device) => {
					const newDevice = {
						id: device._id,
						type: "custom",
						position: device.Position,
						data: { label: device.Label}
					}
					setNodes((ns) => ns.concat(newDevice))
				})
				.catch((error) => {
					console.log(error)
					message.error("Something went wrong")
				})

		}, [reactFlowInstance])

	const onNodesDelete = useCallback(async (node: any) => {
		// delete api Call
		await apiEndpoint(ENDPOINTS.devices.deleteDevice)
			.delete(node.id)
		setNodes((ns) => ns.filter(n => n.id !== node.id))
	}, [setNodes])

	const onEdgesDelete = useCallback(async (edge: any) => {
		await apiEndpoint(ENDPOINTS.devices.removeChildren + `?parent=${edge[0].source}&child=${edge[0].target}`)
			.put("", {})
	}, [setEdges])


	return (
		<ReactFlowProvider>
			<div style={{ margin: 8, width: '70dvw', height: '60dvh', background: "#f8faff", borderRadius: '15px', border: '1px solid #0f0600'}} ref={reactFlowWrapper}>

				<ReactFlow
					nodes={nodes}
					onNodesChange={onNodesChange}
					edges={edges}
					onEdgesChange={onEdgesChange}
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					onInit={setReactFlowInstance}
					className="react-flow-node-toolbar-example"
					nodeTypes={nodeTypes}
					fitView
					defaultEdgeOptions={{ animated: true, style: { stroke: '#0047AB', strokeWidth: '4.5' } }}
					onConnect={onConnect}
					onNodesDelete={onNodesDelete}
					onEdgesDelete={onEdgesDelete}

					onDrop={onDrop}
					onDragOver={onDragOver}

					onNodeDragStop={handleNodeDragStop}
				>
					<Background variant={BackgroundVariant.Dots} color={'black'} />

					{ showMiniMap ? <MiniMap/> : null }
					<Controls/>
				</ReactFlow>

			</div>
			<Button onClick={() => setShowMiniMap(!showMiniMap)}>{ showMiniMap ? "Hide Map" : "Show Map"}</Button>
			<Sidebar />
		</ReactFlowProvider>
	)
}
