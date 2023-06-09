import {JSX, useEffect, useState} from "react";
import useForm from "../../helper/useForm.ts";
import {Form, Input, Button, message, Typography, Select} from "antd";
import {apiEndpoint, ENDPOINTS} from "../../helper/api";

export interface ICustomerModel {
	Name: string
	Email: string
	Phone: string
	Address: string
	Device: string
}

const customerModel = (): ICustomerModel => ({
	Name: "",
	Email: "",
	Phone: "",
	Address: "",
	Device: ""
})

interface IDeviceTemp {
	_id: string
	Label: string
}

export default function AddCustomer(): JSX.Element {
	const { values, setValues, handleChange, errors, setErrors } = useForm(customerModel())
	const [messageApi, contextHolder] = message.useMessage()
	const [loading, setLoading] = useState(false)
	const [availableDevices, setAvailableDevices] = useState(Array<IDeviceTemp>)

	useEffect(() => {
		apiEndpoint(ENDPOINTS.devices.getAvailableDevices)
			.get()
			.then((response) => {
				console.log(response.data)
				setAvailableDevices(response.data.devices)
			})
			.catch((error) => {
				console.log(error)
			})
	}, [])

	function handleAddCustomer() {
		if (validate()) {
			console.log(values)
			setLoading(true)
			apiEndpoint(ENDPOINTS.customers.addCustomer)
				.post(values)
				.then((response) => {
					return response.data
				})
				.then(data => {
					console.log(data)
					messageApi.success("Customer added successfully")
					// filter out the device that was selected
					setAvailableDevices(availableDevices.filter((device) => device._id !== values.Device))
					setValues({ ...values, Device: ""})
				})
				.catch((error) => {
					console.log(error)
					messageApi.error("Something went wrong!")
				})
				.finally(() => {
					setLoading(false)
				})
		}
	}

	function validate() {
		let temp: ICustomerModel = {
			Name: values.Name ? "" : "Name is required",
			Email: values.Email ? "" : "Email is required",
			Phone: values.Phone ? "" : "Phone is required",
			Address: values.Address ? "" : "Address is required",
			Device: values.Device ? "" : "Device is required"
		}
		setErrors({
			...temp
		})
		return Object.values(temp).every(x => x === "")
	}

	return (
		<div>
			{ contextHolder }
			<Typography.Title level={2}>
				Add Customer
			</Typography.Title>
			<Form
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				style={{ maxWidth: 600 }}
				onFinish={handleAddCustomer}
				autoComplete="off"
			>
				<Form.Item
					label="Name"
					name="Name"
					help={errors.Name}
				>
					<Input
						name="Name"
						value={values.Name}
						onChange={handleChange}
					/>
				</Form.Item>

				<Form.Item
					label="Email"
					name="Email"
					help={errors.Email}
				>
					<Input
						name="Email"
						value={values.Email}
						onChange={handleChange}
					/>
				</Form.Item>

				<Form.Item
					label="Phone"
					name="Phone"
					help={errors.Phone}
				>
					<Input
						name="Phone"
						value={values.Phone}
						onChange={handleChange}
					/>
				</Form.Item>

				<Form.Item
					label="Address"
					name="Address"
					help={errors.Address && errors.Address !== "" ? errors.Address : ""}
				>
					<Input
						name="Address"
						value={values.Address}
						onChange={handleChange}
					/>
				</Form.Item>

				<Form.Item label="Device"
						   validateStatus={errors.Device ? "error" : "success"}
						   help={errors.Device}
				>
					<Select
						size="large"
						value={values.Device}
						onChange={(value: string) => setValues({
							...values,
							Device: value
						})}
						placeholder="Choose Device"
					>
						{availableDevices && availableDevices.map((device: IDeviceTemp) => {
							return <Select.Option key={device._id} value={device._id}>{device.Label}</Select.Option>
						})}
					</Select>
				</Form.Item>

				<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
					<Button type="primary" htmlType="submit" loading={loading}>
						Submit
					</Button>
				</Form.Item>
			</Form>
		</div>
	)
}
