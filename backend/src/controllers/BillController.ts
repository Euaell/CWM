import { Request, Response, NextFunction } from "express"
import BillModel, { IBill } from "../models/BillModel"
import CustomerModel, { ICustomer } from "../models/CustomerModel";

export default class BillController {
	static async getAll(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			const { limit, page } = req.query
			const total: number = await BillModel.countDocuments()
			const bills: IBill[] = await BillModel.find().limit(parseInt(limit as string)).skip((parseInt(page as string) - 1) * parseInt(limit as string)).populate('Customer', '-__v -Password -Device -createdAt -updatedAt')
			return res.status(200).json({ bills, total })
		} catch (error) {
			next(error)
		}
	}

	static async create(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			const { Rate } = req.body

			// get all customers with unpaid water consumption
			const customers: ICustomer[] = await CustomerModel.find({ Volume: { $gt: 0 } })
			const bills: IBill[] = []
			for await (const customer of customers) {
				const { Volume, _id } = customer
				const Amount = Volume * Rate
				// create a bill for each customer
				const bill: IBill = await BillModel.create({ Customer: _id, Volume, Amount })

				// reset the customer's water consumption
				customer.Volume = 0
				await customer.save()

				bills.push(bill)
			}

			return res.status(201).json({ bills })
		} catch (error) {
			next(error)
		}
	}

	static async read(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			const { id } = req.params
			const bill: IBill = await BillModel.findById(id)
			if (!bill) {
				return res.status(404).json({ message: 'Bill not found' })
			}
			return res.status(200).json({ bill })
		} catch (error) {
			next(error)
		}
	}

	static async update(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			const { id } = req.params
			const { Customer, volume, flow, amount, date } = req.body
			const bill: IBill = await BillModel.findByIdAndUpdate(id, { Customer, volume, flow, amount, date })
			if (!bill) {
				return res.status(404).json({ message: 'Bill not found' })
			}
			return res.status(200).json({ bill })
		} catch (error) {
			next(error)
		}
	}

	static async delete(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			const {id} = req.params
			const bill: IBill = await BillModel.findByIdAndDelete(id)
			if (!bill) {
				return res.status(404).json({message: 'Bill not found'})
			}
			return res.status(200).json({bill})
		} catch (error) {
			next(error)
		}
	}
}
