import {JSX, useState} from "react";
import useForm from "../helper/useForm.ts";
import {Button, Form, Input, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import {apiEndpoint, ENDPOINTS} from "../helper/api";
import {useAuth} from "../helper/useAuth.ts";

const freshChangePasswordModel = () => ({
	currentPassword: "",
	newPassword: "",
	confirmPassword: ""
})
export default function Setting(): JSX.Element {
	const { values, handleChange, errors, setErrors } = useForm(freshChangePasswordModel())
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()
	const { resetUser } = useAuth()

	function onFinish() {
		if (validate()) {
			setLoading(true)
			apiEndpoint(ENDPOINTS.user.changePassword)
				.post(values)
				.then((response) => {
					return response.data
				})
				.then(res => {
					console.log(res)
					resetUser()
					navigate("/auth/login")
				})
				.catch(error => {
					console.log(error)
					setErrors({
						...error.response?.data
					})
				})
				.finally(() => {
					setLoading(false)
				})
		}
	}

	function validate() {
		let tmp = {
			currentPassword: values.currentPassword ? "" : "Current Password is required",
			newPassword: values.newPassword ? "" : "New Password is required",
			confirmPassword: values.confirmPassword ?
				(values.confirmPassword != values.newPassword ? "Password doesn't much!" : "") :
				"Confirm Password is required"
		}
		setErrors({
			...tmp
		})
		return Object.values(tmp).every(x => x === "")
	}

	return (
		<div style={{ margin: "auto", width: "40%" }}>
			<Typography.Title level={2} style={{ textAlign: "center"}}>
				Change Password
			</Typography.Title>

			<Form
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				style={{ maxWidth: 500 }}
				onFinish={onFinish}
				autoComplete="off"
			>
				 <Form.Item
					label="Password"
					name="password"
					validateStatus={errors.currentPassword ? "error" : ""}
					help={errors.currentPassword}
				>
					<Input.Password
						name="currentPassword"
						value={values.currentPassword}
						onChange={handleChange}
					/>
				</Form.Item>

				 <Form.Item
					label="New Password"
					name="newPassword"
					validateStatus={errors.newPassword ? "error" : ""}
					help={errors.newPassword}
				>
					<Input.Password
						name="newPassword"
						value={values.newPassword}
						onChange={handleChange}
					/>
				</Form.Item>

				 <Form.Item
					label="Confirm Password"
					name="confirmPassword"
					validateStatus={errors.confirmPassword ? "error" : ""}
					help={errors.confirmPassword}
				>
					<Input.Password
						name="confirmPassword"
						value={values.newPassword}
						onChange={handleChange}
					/>
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
