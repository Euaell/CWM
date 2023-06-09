import {Document, Model, model, Schema} from "mongoose"

export interface ICustomer extends Document {
	Name: string
	Email: string
	Phone: string
	Address: string
	Quota: number
	Volume: number
	Device: Schema.Types.ObjectId

	UpdateQuota: (newQuota: number) => Promise<void>
	ResetVolume: () => Promise<void>
	CheckQuota: () => Promise<boolean>
}

interface ICustomerModel extends Model<ICustomer> {
	CreateCustomer: (name: string, email: string, phone: string, address: string, Device: string, quota?: number | null) => Promise<ICustomer>
	FindCustomer: (email: string) => Promise<ICustomer | null>
}

const CustomerSchema: Schema<ICustomer> = new Schema<ICustomer>(
	{
		Name: {
			type: String,
			required: true
		},
		Email: {
			type: String,
			validate: {
				// check if email is valid and not null and not empty
				validator: (value: string) => value && value.length > 0 && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
				message: "Invalid email"
			},
			unique: true,
			required: true
		},
		Phone: {
			type: String,
			validate: {
				validator: (value: string) => {
					return /^\d{10}$/.test(value)
				}
			},
			required: true,
			unique: true
		},
		Address: {
			type: String,
			required: true
		},
		Quota: {
			type: Number,
			required: true,
			default: 1000
		},
		Volume: {
			type: Number,
			required: true,
			default: 0
		},
		Device: {
			type: Schema.Types.ObjectId,
			ref: 'Device',
			required: true,
			unique: true
		},
	},
	{
		timestamps: true
	}
)

CustomerSchema.statics.CreateCustomer = async function (name: string, email: string, phone: string, address: string, Device: string, quota: number | null = null) {
	return await this.create({Name: name, Email: email, Phone: phone, Address: address, Device, Quota: quota || 1000})
}

CustomerSchema.statics.FindCustomer = async function (email: string) {
	return await this.findOne({Email: email})
}

CustomerSchema.methods.UpdateQuota = async function (newQuota: number) {
	this.Quota = newQuota
	await this.save()
}

CustomerSchema.methods.ResetVolume = async function () {
	this.Volume = 0
	await this.save()
}

CustomerSchema.methods.CheckQuota = async function () {
	return this.Volume < this.Quota
}

export default model<ICustomer, ICustomerModel>("Customer", CustomerSchema)
