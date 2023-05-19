import axios, { AxiosInstance } from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL

const api: AxiosInstance = axios.create({
	baseURL: BASE_URL,
	withCredentials: true,
	responseType: "json"
})

interface IEndpoints {
	users: {
		login: string,
		logout: string,
		verify: string,
		getUserByID: string
	},
	devices: {
		getDevices: string,
		addDevice: string,
		updateDevice: string,
		deleteDevice: string,
		addChildDevice: string
	}
}

export const ENDPOINTS: IEndpoints = {
	users: {
		login: "users/login",
		logout: "users/logout",
		verify: "users/verifyuser",
		getUserByID: "users"
	},
	devices: {
		getDevices: "devices",
		addDevice: "devices",
		updateDevice: "devices",
		deleteDevice: "devices",
		addChildDevice: "devices/add-children"
	}
}

export function apiEndpoint (endpoint: string) {
	const url: string = `${BASE_URL}/${endpoint}`

	return {
		get: () => api.get(url),
		getByID: (id: string) => api.get(`${url}/${id}`),
		post: (body: any) => api.post(url, body),
		put: (id: string, body: any) => api.put(`${url}/${id}`, body),
		delete: (id: string) => api.delete(`${url}/${id}`)
	}
}
