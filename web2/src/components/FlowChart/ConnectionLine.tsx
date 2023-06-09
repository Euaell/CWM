export default function ConnectionLine({ fromX, fromY, toX, toY } : { fromX: number, fromY: number, toX: number, toY: number}) {
	return (
		<g>
			<path
				fill="none"
				stroke="#89CFF0" // baby blue
				strokeWidth={3.5}
				className="animated"
				d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
			/>
			<circle cx={toX} cy={toY} fill="#fff" r={3} stroke="#222" strokeWidth={1.5} />
		</g>
	)
}
