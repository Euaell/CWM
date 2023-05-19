import { Schema, model, Model, Document } from 'mongoose'

export enum deviceStateEnum {
	open = 'open',
	close = 'close'
}
export interface IDevice extends Document {
	Name: string
	State: deviceStateEnum
	Position: {
		x: number
		y: number
	}
	FlowRate: number
	Children: Schema.Types.ObjectId[]
}

interface DeviceModel extends Model<IDevice> {

}

const deviceSchema: Schema<IDevice> = new Schema<IDevice>(
	{
		Name: {
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
				required: true
			},
			y: {
				type: Number,
				required: true
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
		}
	},
	{ timestamps: true }
)

export default model<IDevice, DeviceModel>('Device', deviceSchema)
