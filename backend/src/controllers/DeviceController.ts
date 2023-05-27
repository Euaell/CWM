import { Request, Response, NextFunction } from "express"
import DeviceModel, { IDevice, deviceStateEnum } from "../models/DeviceModel"
import {Schema} from "mongoose";

export default class DeviceController {
	static async getAll(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			const { isActivated } = req.query

			const query = { isActivated: true }
			if (isActivated !== undefined) {
				if (isActivated === "false")
					query['isActivated'] = false
			}

			const devices: IDevice[] = await DeviceModel.find(query)
			return res.status(200).json({ devices })
		} catch (error) {
			next(error)
		}
	}

	static async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			const { Label, City, Address, user } = req.body
			const device: IDevice = await DeviceModel.create({ Label, City, Address, Admin: user._id })

			return res.status(201).json({ device })
		} catch (error) {
			next(error)
		}
	}

	static async read(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			const { id } = req.params
			const { flow } = req.body

			const device: IDevice = await DeviceModel.findById(id)
			if (!device) {
				return res.status(404).json({ message: "Device not found" })
			}
			if (device.State === deviceStateEnum.close) {
				return res.status(200).json({ message: deviceStateEnum.close })
			}
			if (flow) {
				device.FlowRate = flow
				await device.save()
			}

			return res.status(200).json({ message: deviceStateEnum.open })

		} catch (error) {
			next(error)
		}
	}

	static async update(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			const { id } = req.params
			const { State }: { State: deviceStateEnum } = req.body
			const { Position } = req.body

			const device: IDevice = await DeviceModel.findById(id)
			if (!device) {
				return res.status(404).json({ message: "Device not found" })
			}
			if (State) {
				device.State = State
				await device.save()
			}

			if ( Position ) {
				device.Position = Position
				device.isActivated = true
				await device.save()
			}

			return res.status(200).json({ message: "update", device })

		} catch (error) {
			next(error)
		}
	}

	static async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
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

	static async addChildren(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			const { parent, child } = req.query

			const parentDevice: IDevice = await DeviceModel.findById(parent.toString().replace("/", ""))
			const childDevice: IDevice = await DeviceModel.findById(child.toString().replace("/", ""))

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

	static async removeChildren(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			const { parent, child } = req.query

			const parentDevice: IDevice = await DeviceModel.findById(parent.toString().replace("/", ""))
			const childDevice: IDevice = await DeviceModel.findById(child.toString().replace("/", ""))

			if (!parentDevice || !childDevice) {
				return res.status(404).json({ message: "Device not found" })
			}

			const tmpParentDevice: IDevice = await DeviceModel.findByIdAndUpdate(parent.toString().replace("/", ""),
				{ $pull : {Children: child.toString().replace("/", "")} })

			return res.status(200).json({ message: "removeChildren", parentDevice: tmpParentDevice })
		} catch (error) {
			next(error)
		}
	}

	static async getCities(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			const cities: string[] = await DeviceModel.distinct("City")
			return res.status(200).json({ cities })
		} catch (error) {
			next(error)
		}
	}
}
