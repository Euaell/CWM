import { Response, Request, NextFunction } from "express"
import UserModel, {IUser, roleEnum} from "../models/UserModel";


export default class UserController {
	static async createUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { Name, Email, Password, Phone } = req.body
			const user: IUser = await UserModel.create({ Name, Email, Password, Phone })
			const userObj = user.toObject()
			delete userObj.Password
			delete userObj.__v

			res.status(201).json({ message: "User created", user: userObj })
		} catch (error) {
			next(error)
		}
	}

	static async getUsers(req: Request, res: Response, next: NextFunction) {
		try {
			const users: IUser[] = await UserModel.find().select("-Password -__v")
			res.status(200).json({ message: "Users fetched", users })
		} catch (error) {
			next(error)
		}
	}

	static async getUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params
			const user: IUser = await UserModel.findById(id).select("-Password -__v")
			if (!user) {
				throw new Error("User not found")
			}
			res.status(200).json({ message: "User fetched", user })
		} catch (error) {
			next(error)
		}
	}

	static async updateUser(req: Request, res: Response, next: NextFunction) {
		try {
			// TODO
			const {id} = req.params
			const obj = {}
		} catch (error) {
			next(error)
		}
	}

	static async deleteUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params
			const user = await UserModel.findByIdAndDelete(id)
			if (!user) {
				throw new Error("User not found")
			}
			res.status(200).json({ message: "User deleted", user })
		} catch (error) {
			next(error)
		}
	}

	static async login(req: Request, res: Response, next: NextFunction) {
		try {
			const { Email, Password } = req.body
			const user: IUser = await UserModel.findOne({ Email })
			if (!user) {
				return res.status(400).json({ Email: "Email is not registered" })
			}
			const isMatch = await user.comparePassword(Password)
			if (!isMatch) {
				return res.status(400).json({ Password: "Password is incorrect" })
			}
			// userobj is the user object without the password and __v
			const userObj = user.toObject()
			delete userObj.Password
			delete userObj.__v

			const token = user.generateToken()
			res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
			res.status(200).json({ message: "Login successful", user: userObj, token })
		} catch (error) {
			next(error)
		}
	}

	static async logout(req: Request, res: Response, next: NextFunction) {
		try {
			res.clearCookie("token")
			res.status(200).json({ message: "Logout successful" })
		} catch (error) {
			next(error)
		}
	}

	static async verifyUser(req: Request, res: Response, next: NextFunction) {
		try {
			const { user } = req.body
			res.status(200).json({ message: "User verified", user })
		} catch (error) {
			next(error)
		}
	}

	static async makeAdmin(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params
			const user: IUser = await UserModel.findByIdAndUpdate(id, { role: roleEnum.admin }, { new: true })
			if (!user) {
				throw new Error("User not found")
			}
			const userObj = user.toObject()
			delete userObj.Password
			delete userObj.__v

			res.status(200).json({ message: "User made admin", user: userObj })
		} catch (error) {
			next(error)
		}
	}

	static async removeAdmin(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params
			const user: IUser = await UserModel.findByIdAndUpdate(id, { role: roleEnum.customer }, { new: true })
			if (!user) {
				throw new Error("User not found")
			}
			const userObj = user.toObject()
			delete userObj.password
			delete userObj.__v
			res.status(200).json({ message: "Admin removed", user: userObj })
		} catch (error) {
			next(error)
		}
	}

	static async changePassword(req: Request, res: Response, next: NextFunction) {
		try {
			const { currentPassword: oldPassword, password: newPassword } = req.body
			console.log(oldPassword, newPassword)
			const { user } = req.body
			console.log(user)
			const isMatch = await user.comparePassword(oldPassword)
			if (!isMatch) {
				return res.status(401).json({ message: "Password is incorrect" })
			}
			user.password = newPassword
			const updatedUser: IUser = await user.save()
			const userObj = updatedUser.toObject()
			delete userObj.password
			delete userObj.__v

			res.status(200).json({ message: "Password changed", user: userObj })
		} catch (error) {
			next(error)
		}
	}
}
