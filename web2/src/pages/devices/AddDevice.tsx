import { JSX, useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Select, Typography, message } from "antd";
import useForm from "../../helper/useForm.ts";
import { PlusOutlined } from "@ant-design/icons";
import { apiEndpoint, ENDPOINTS } from "../../helper/api";

interface IAddDevice {
	City: string
	Address: string
	Label: string
}

const freshAddDeviceMode = (): IAddDevice => ({
	City: "",
	Address: "",
	Label: ""
})

export default function AddDevice(): JSX.Element {
	const [cityOptions, setCityOptions] = useState(Array<string>)
	const [city, setCity] = useState([])
	const { values, setValues, handleChange, errors, setErrors } = useForm(freshAddDeviceMode())
	const [loading, setLoading] = useState(false)
	const [messageApi, contextHolder] = message.useMessage()

	useEffect(() => {
		apiEndpoint(ENDPOINTS.devices.getCities)
			.get()
			.then((response) => {
				setCityOptions(response.data.cities.map((city: string) => {
					return { label: city, value: city}
				}))
			})
			.catch((error) => {
				console.log(error)
			})

	}, [])

	function handleSubmit() {
		if (validate()) {
			setLoading(true)
			apiEndpoint(ENDPOINTS.devices.addDevice)
				.post(values)
				.then(() => {
					messageApi.open({
						type: "success",
						content: "Devices Added SuccessFully",
						onClose: () => window.location.reload()
					})
				})
				.catch(() => {
					messageApi.open({
						type: "error",
						content: "Something went Wrong!"
					})
				})
				.finally(() => {
					setLoading(false)
				})
		}
	}

	function validate() {
		let temp: IAddDevice = {
			City: values.City ? "" : "City is required",
			Address: values.Address ? "" : "Address is required",
			Label: values.Label ? "" : "Label is required"
		}
		setErrors({
			...temp
		})
		return Object.values(temp).every(x => x === "")
	}

	function handleCityChange(value: Array<string>) {
		setCity([value[value.length - 1]])
		setValues({
			...values,
			City: value[value.length - 1]
		})
	}

	return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "start" }}>
			{ contextHolder }
			<Form onFinish={handleSubmit} style={{ marginTop: "2.5rem" }}>
				<Form.Item style={{ textAlign: "center" }}>
					<Typography.Title level={3}> Add Device </Typography.Title>
				</Form.Item>

				<Form.Item label="Label"
						   validateStatus={errors.Label ? "error" : "success"}
						   help={errors.Label}
				>
					<Input
						size="large"
						name="Label"
						value={values.Label}
						onChange={handleChange}
						placeholder="Enter Label"
					/>
				</Form.Item>
				<Row gutter={12}>
					<Col span={12}>
						<Form.Item label="City"
								   validateStatus={errors.City ? "error" : "success"}
								   help={errors.City}
						>
							<Select
								mode="tags"
								size="large"
								value={city}
								onChange={handleCityChange}
								options={cityOptions}
								placeholder="Choose city"
							/>
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item label="Address"
								   validateStatus={errors.Address ? "error" : "success"}
								   help={errors.Address}
						>
							<Input
								size="large"
								name="Address"
								value={values.Address}
								onChange={handleChange}
								placeholder="Enter Address"
							/>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item>
					<Button type="primary" icon={<PlusOutlined />} htmlType="submit" block loading={loading}>
						Add Device
					</Button>
				</Form.Item>
			</Form>
		</div>
	)
}
