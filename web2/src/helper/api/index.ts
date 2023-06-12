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
		deleteCustomer: string,
		getCustomerAverage: string
	},
	devices: {
		getDevices: string,
		getDeviceByID: string,
		addDevice: string,
		updateDevice: string,
		deleteDevice: string,
		addChildren: string,
		removeChildren: string
		getCities: string
		getAvailableDevices: string
	},
	bills: {
		getBills: string,
		getBillByID: string,
		getBillChartData: string,
		getBillChardDataByYear: string,
		getUsageDataByYear: string,
		createBills: string
	},
	user: {
		login: string,
		logout: string,
		verify: string,
		getCitiesAndUsages: string,
		changePassword: string
	}
}

export const ENDPOINTS: IEndpoints = {
	customers: {
		getCustomers: "customers",
		getCustomerByID: "customers",
		addCustomer: "customers/create",
		updateCustomer: "customers",
		deleteCustomer: "customers",
		getCustomerAverage: "customers/customer-average"
	},
	devices: {
		getDevices: "devices",
		getDeviceByID: "devices",
		addDevice: "devices",
		updateDevice: "devices",
		deleteDevice: "devices",
		addChildren: "devices/add-children",
		removeChildren: "devices/remove-children",
		getCities: "devices/get-cities",
		getAvailableDevices: "devices/get-available-devices"
	},
	bills: {
		getBills: "bills",
		getBillByID: "bills",
		getBillChartData: "bills/get-chart-data",
		getBillChardDataByYear: "bills/get-chart-yearly-data",
		getUsageDataByYear: "bills/get-yearly-usage-data",
		createBills: "bills/create"
	},
	user: {
		login: "users/login",
		logout: "users/logout",
		verify: "users/verifyuser",
		getCitiesAndUsages: "users/get-cities-usage",
		changePassword: "users/changepassword"
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
