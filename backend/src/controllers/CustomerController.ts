import { Request, Response, NextFunction } from "express"
import CustomerModel, { ICustomer } from "../models/CustomerModel"

export default class CustomerController {
	static async createCustomer(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			const { Name, Email, Phone, Address, Device } = req.body
			const customer: ICustomer = await CustomerModel.CreateCustomer( Name, Email, Phone, Address, Device )
			return res.status(201).json({ customer })
		} catch (error) {
			next(error)
		}
	}

	static async getCustomers(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			const { query } = req
			const { Phone, Name, Email, Address } = query
			const objQuery: any = {}
			if (Phone) {
				objQuery.Phone = { $regex: Phone, $options: 'i' }
			}
			if (Name) {
				objQuery.Name = { $regex: Name, $options: 'i' }
			}
			if (Email) {
				objQuery.Email = { $regex: Email, $options: 'i' }
			}
			if (Address) {
				objQuery.Address = { $regex: Address, $options: 'i' }
			}

			const limit = parseInt(query.limit as string) || 10
			const page = parseInt(query.page as string) || 1

			const total = await CustomerModel.countDocuments(objQuery)

			const customers = await CustomerModel.find(objQuery).limit(limit).skip((page - 1) * limit)
			return res.status(200).json({ customers, total })
		} catch (error) {
			next(error)
		}
	}

	static async getCustomer(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			const { id } = req.params
			const customer = await CustomerModel.findById(id)
			if (!customer) {
				return res.status(404).json({ message: 'Customer not found' })
			}
			return res.status(200).json({ customer })
		} catch (error) {
			next(error)
		}
	}

	static async updateCustomer(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			return res.status(200).json({ message: 'Customer NOT updated!' })
		} catch (error) {
			next(error)
		}
	}

	static async deleteCustomer(req: Request, res: Response, next: NextFunction): Promise<Response> {
		try {
			const { id } = req.params
			const customer = await CustomerModel.findByIdAndDelete(id)
			if (!customer) {
				return res.status(404).json({ message: 'Customer not found' })
			}
			return res.status(200).json({ message: 'Customer deleted successfully', customer })
		} catch (error) {
			next(error)
		}
	}


}
