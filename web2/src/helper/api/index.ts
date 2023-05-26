import axios, { AxiosInstance } from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL

const api: AxiosInstance = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
	responseType: "json"
})

interface IEndpoints {
	customers: {
		getCustomers: string,
		getCustomerByID: string,
		addCustomer: string,
		updateCustomer: string,
		deleteCustomer: string
	},
	devices: {
		getDevices: string,
		getDeviceByID: string,
		addDevice: string,
		updateDevice: string,
		deleteDevice: string,
		addChildren: string,
		removeChildren: string
	},
	bills: {
		getBills: string,
		getBillByID: string
	},
	user: {
		login: string,
		logout: string,
		verify: string
	}
}

export const ENDPOINTS: IEndpoints = {
	customers: {
		getCustomers: "customers",
		getCustomerByID: "customers",
		addCustomer: "customers",
		updateCustomer: "customers",
		deleteCustomer: "customers"
	},
	devices: {
		getDevices: "devices",
		getDeviceByID: "devices",
		addDevice: "devices",
		updateDevice: "devices",
		deleteDevice: "devices",
		addChildren: "devices/add-children",
		removeChildren: "devices/remove-children"
	},
	bills: {
		getBills: "bills",
		getBillByID: "bills"
	},
	user: {
		login: "users/login",
		logout: "users/logout",
		verify: "users/verifyuser"
	}
}

export function apiEndpoint (endpoint: string) {
	const url: string = `${BASE_URL}/${endpoint}`

	return {
		get: async (id?: string) => {
			if (id) {
				return await api.get(`${url}/${id}`)
			}
			return await api.get(url)
		},
		post: async (data: any) => {
			return await api.post(url, data)
		},
		put: async (id: string, data: any) => {
			return await api.put(`${url}/${id}`, data)
		},
		delete: async (id: string) => {
			return await api.delete(`${url}/${id}`)
		}
	}
}
