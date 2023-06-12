import { NextFunction, Request, Response } from "express"
import UserModel, { IUser, roleEnum } from "../models/UserModel"
import jwt from "jsonwebtoken"
import configs from "../config/configs";

export default class Authenticate {
	static async authenticate(req: Request, res: Response, next: NextFunction) {
		try {
			const token = req.headers.token || req.cookies.token

			if (!token) {
				return res.status(401).json({ message: 'Unauthorized' })
			}
			const decoded = jwt.verify(token, configs.JWT_SECRET)
			const user: IUser | null = await UserModel.findById(decoded._id).select("-Password -__v")
			if (!user) {
				res.clearCookie("token")
				return res.status(401).json({ message: 'Unauthorized' })
			}

			req.body.user = user
			next()
		} catch (error) {
			next(error)
		}
	}

	static async authorize(req: Request, res: Response, next: NextFunction) {
		try {
			const { user }: { user: IUser } = req.body
			if (user.Role !== roleEnum.admin) {
				return res.status(401).json({ message: 'Unauthorized. Only Administrators can create new users' })
			}
			next()
		} catch (error) {
			next(error)
		}
	}
}
