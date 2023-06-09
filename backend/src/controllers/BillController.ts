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

	static async getBillChartData(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			const bills: IBill[] = await BillModel.find()
			let Paid: number = 0
			let Unpaid: number = 0
			let Overdue: number = 0
			for await (const bill of bills) {
				if (bill.Paid) {
					Paid++
				} else {
					// check if the bill is overdue( 15 days after the bill is created)
					if (bill.CreatedAt.getTime() + 15 * 24 * 60 * 60 * 1000 < Date.now()) {
						Overdue++
					} else {
						Unpaid++
					}
				}
			}

			return res.status(200).json([ Paid, Unpaid, Overdue ])
		} catch (error) {
			next(error)
		}
	}

	static async getBillChardDataByYear(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			const { year } = req.query
			// return in the format { paid: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], unpaid: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}, (overdue the same as unpaid)
			const yearNumber: number = Number(year as string)
			const bills: IBill[] = await BillModel.find({ CreatedAt: { $gte: new Date(yearNumber, 0, 1), $lte: new Date(yearNumber, 11, 31) } })
			const paid: number[] = Array(12).fill(0)
			const unpaid: number[] = Array(12).fill(0)
			for await (const bill of bills) {
				if (bill.Paid) {
					paid[bill.CreatedAt.getMonth()]++
				} else {
					unpaid[bill.CreatedAt.getMonth()]++
				}
			}

			return res.status(200).json({ paid, unpaid })
		} catch (error) {
			next(error)
		}
	}

	static async getUsageDataByYear(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			const { year } = req.query
			// return in the format { usage: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
			const yearNumber: number = Number(year as string)

			const bills: IBill[] = await BillModel.find({ CreatedAt: { $gte: new Date(yearNumber, 0, 1), $lte: new Date(yearNumber, 11, 31) } })
			const usage: number[] = Array(12).fill(0)
			for await (const bill of bills) {
				usage[bill.CreatedAt.getMonth()] += bill.Volume
			}

			return res.status(200).json({ usage })
		} catch (error) {
			next(error)
		}
	}
}
