import { JSX, useState } from "react";
import { Button, Form, Input, Typography } from 'antd'
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import useForm from "../helper/useForm.ts";
import { apiEndpoint, ENDPOINTS } from "../helper/api";
import { useAuth } from "../helper/useAuth.ts";
import {useNavigate} from "react-router-dom";

const { Title } = Typography

interface ILoginModel {
	Email: string
	Password: string
}
const loginModel = (): ILoginModel => ({
	Email: "",
	Password: ""
})

export default function Login() : JSX.Element {
	const { values, handleChange, errors, setErrors } = useForm(loginModel())
	const [loading, setLoading] = useState(false)
	const { setUser } = useAuth()
	const navigate = useNavigate()

	function handleLogin()  {
		if (validate()) {
			setLoading(true)
			apiEndpoint(ENDPOINTS.user.login)
				.post(values)
				.then((response) => {
					setLoading(false)
					return response.data
				})
				.then(data => {
					setUser({
						...data.user,
						token: data.token
					})
					navigate("/")
				})
				.catch((error) => {
					setLoading(false)
					setErrors({
						...error.response?.data
					})
				})
		}
	}

	function validate() {
		let temp: ILoginModel = {
			Email: values.Email ? "" : "Email is required",
			Password: values.Password ? "" : "Password is required"
		}
		setErrors({
			...temp
		})
		return Object.values(temp).every(x => x === "")
	}

	return (
		<Form style={{ width: "300px", backgroundColor: "rgba(221,230,236,0.71)", padding: "20px", borderRadius: "10px", boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.4)" }}
			onFinish={handleLogin} >

			<Form.Item style={{ textAlign: "center" }}>
				<Title level={3}> Login </Title>
			</Form.Item>

			<Form.Item
				validateStatus={errors.Email && errors.Email !== "" ? "error" : ""}
				help={errors.Email && errors.Email !== "" ? errors.Email : ""}
			>
				<Input
					prefix={<UserOutlined />}
					name="Email"
					value={values.Email}
					onChange={handleChange}
					placeholder="Email"
				/>
			</Form.Item>

			<Form.Item
				validateStatus={errors.Password && errors.Password !== "" ? "error" : ""}
				help={errors.Password && errors.Password !== "" ? errors.Password : ""}
			>
				<Input.Password
					prefix={<LockOutlined />}
					name="Password"
					value={values.Password}
					onChange={handleChange}
					placeholder="Password"
				/>
			</Form.Item>

			<Form.Item>
				<Button type="primary" htmlType="submit" block loading={loading}>
					Login
				</Button>
			</Form.Item>
		</Form>
	)
}
