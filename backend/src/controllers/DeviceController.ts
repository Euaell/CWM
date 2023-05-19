import { Request, Response, NextFunction } from "express"
import DeviceModel, { IDevice, deviceStateEnum } from "../models/DeviceModel"
import {Schema} from "mongoose";

export default class DeviceController {
	static async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const devices: IDevice[] = await DeviceModel.find({})
			res.status(200).json({ devices })
		} catch (error) {
			next(error)
		}
	}

	static async create(req: Request, res: Response, next: NextFunction) {
		try {
			const { Name, Position } = req.body
			const device: IDevice = await DeviceModel.create({ Name, Position })
			res.status(201).json({ device })
		} catch (error) {
			next(error)
		}
	}

	static async read(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params
			const { flow } = req.body

			const device: IDevice = await DeviceModel.findById(id)
			if (!device) {
				return res.status(404).json({ message: "Device not found" })
			}
			if (device.State === deviceStateEnum.close) {
				return res.status(200).json({ message: "close" })
			}
			if (flow) {
				device.FlowRate = flow
				await device.save()
			}

			return res.status(200).json({ message: "read" })

		} catch (error) {
			next(error)
		}
	}

	static async update(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params
			const { state }: { state: deviceStateEnum } = req.body

			const device: IDevice = await DeviceModel.findById(id)
			if (!device) {
				return res.status(404).json({ message: "Device not found" })
			}
			if (state) {
				device.State = state
				await device.save()
			}

			return res.status(200).json({ message: "update" })

		} catch (error) {
			next(error)
		}
	}

	static async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params

			const node: IDevice = await DeviceModel.findByIdAndDelete(id)
			if (!node) {
				return res.status(404).json({ message: "Device not found" })
			}

			// find devices that contain id as a child and pull it out
			const devices: IDevice[] = await DeviceModel.find({ children: { $in: [id] } })
			for await (const device of devices) {
				device.Children = await new Promise<Schema.Types.ObjectId[]>(
					(resolve, reject) => {
						device.Children.filter(child => child.toString() !== id)
						resolve(device.Children)
					}
				)
				await device.save()
			}

			return res.status(200).json({ message: "delete" })
		} catch (error) {
			next(error)
		}
	}

	static async addChildren(req: Request, res: Response, next: NextFunction) {
		try {
			const { parent, child } = req.query

			const parentDevice: IDevice = await DeviceModel.findById(parent)
			const childDevice: IDevice = await DeviceModel.findById(child)

			if (!parentDevice || !childDevice) {
				return res.status(404).json({ message: "Device not found" })
			}

			parentDevice.Children.push(childDevice._id)
			await parentDevice.save()

			return res.status(200).json({ message: "addChildren" })
		} catch (error) {
			next(error)
		}
	}
}
