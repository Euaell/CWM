import { Schema, model, Model, Document } from 'mongoose'

export enum deviceStateEnum {
	open = 'open',
	close = 'close'
}
export interface IDevice extends Document {
	Label: string
	State: deviceStateEnum
	Position: { // for flow-chart
		x: number
		y: number
	}
	City: string
	Address: string
	FlowRate: number
	Children: Schema.Types.ObjectId[]
	ClosedAt: Date | null
	isActivated: boolean
	Admin: Schema.Types.ObjectId
}

interface DeviceModel extends Model<IDevice> {

}

const deviceSchema: Schema<IDevice> = new Schema<IDevice>(
	{
		Label: {
			type: String,
			required: true
		},
		State: {
			type: String,
			enum: Object.values(deviceStateEnum),
			required: true,
			default: deviceStateEnum.close
		},
		Position: {
			x: {
				type: Number,
				required: true,
				default: 0
			},
			y: {
				type: Number,
				required: true,
				default: 0
			}
		},
		FlowRate: {
			type: Number,
			required: true,
			default: 0
		},
		Children: {
			type: [Schema.Types.ObjectId],
			ref: 'Device',
			default: []
		},
		ClosedAt: {
			type: Date || null,
			required: false,
			default: null
		},
		City: {
			type: String,
			required: true
		},
		Address: {
			type: String,
			required: true
		},
		isActivated: {
			type: Boolean,
			required: true,
			default: false
		},
		Admin: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		}
	},
	{ timestamps: true }
)

export default model<IDevice, DeviceModel>('Device', deviceSchema)
