import { Document, Schema, model, Model } from "mongoose"

export enum billingPeriodEnum {
	weekly = 'weekly',
	monthly = 'monthly',
	yearly = 'yearly'
}

export interface IBill extends Document {
	Customer: Schema.Types.ObjectId
	Amount: number
	Rate: number
	Volume: number
	Paid: boolean
	BillingPeriod: billingPeriodEnum
	CreatedAt: Date
}

interface BillModel extends Model<IBill> {

}

const BillSchema: Schema<IBill> = new Schema<IBill>(
	{
		Customer: {
			type: Schema.Types.ObjectId,
			ref: 'Customer',
			required: true
		},
		Amount: {
			type: Number,
			required: true,
			default: 0
		},
		Rate: {
			type: Number,
			required: true,
			default: 2 // 2birr/L
		},
		Volume: {
			type: Number,
			required: true
		},
		Paid: {
			type: Boolean,
			required: true,
			default: false
		},
		BillingPeriod: {
			type: String,
			enum: Object.values(billingPeriodEnum),
			required: true,
			default: billingPeriodEnum.monthly
		}
	},
	{
		timestamps: true
	}
)

export default model<IBill, BillModel>('Bill', BillSchema)
