import { Schema, model, Document, Model } from "mongoose"

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import configs from "../config/configs";

export enum roleEnum {
	admin = 'admin',
	customer = 'customer'
}

export interface IUser extends Document {
	Name: string
	Email: string
	Password: string
	Phone: string
	Role: roleEnum
	comparePassword: (password: string) => Promise<boolean>
	generateToken: () => string
}

interface UserModel extends Model<IUser> {
	findByToken: (token: string) => Promise<IUser | null>
}

const userSchema: Schema<IUser> = new Schema<IUser>(
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
			required: true,
			unique: true
		},
		Password: {
			type: String,
			minlength: 6,
			required: true
		},
		Phone: {
			type: String,
			validate: {
				validator: (value: string) =>  /^\d{10}$/.test(value),
				message: "Invalid phone number"
			},
			required: true,
			unique: true
		},
		Role: {
			type: String,
			enum: Object.values(roleEnum),
			required: true,
			default: roleEnum.customer
		}
	},
	{
		timestamps: true
	}
)

userSchema.methods.comparePassword = async function (password: string) {
	return await bcrypt.compare(password, this.Password)
}

userSchema.methods.generateToken = function () {
	return jwt.sign({ _id: this._id }, configs.JWT_SECRET, { expiresIn: configs.JWT_EXPIRES_IN })
}

userSchema.statics.findByToken = async function (token: string) {
	try {
		const decoded: any = jwt.verify(token, configs.JWT_SECRET)
		return await this.findOne({ _id: decoded._id })
	} catch (e) {
		return null
	}
}

userSchema.pre('save', async function (next) {
	if (this.isModified('Password')) {
		const salt: string = await bcrypt.genSalt()
		this.Password = await bcrypt.hash(this.Password, salt)
	}
	next()
})

export default model<IUser, UserModel>('User', userSchema)
