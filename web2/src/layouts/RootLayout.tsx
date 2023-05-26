import React, { JSX, useState } from 'react';
import {
	LoginOutlined,
	LogoutOutlined, PartitionOutlined, PieChartOutlined,
	PlaySquareOutlined, PlusOutlined, SettingOutlined,
	SolutionOutlined, TeamOutlined, UserOutlined,
} from '@ant-design/icons';

import type { MenuProps } from 'antd';

import {  Layout, Menu, theme, Typography } from 'antd';
import {NavigateFunction, Outlet, useNavigate} from "react-router-dom";
import {IUser} from "../helper/UserProvider.tsx";
import {useAuth} from "../helper/useAuth.ts";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
	label: React.ReactNode,
	key: React.Key,
	show: boolean,
	icon?: React.ReactNode,
	children?: MenuItem[],
): MenuItem | null {
	if (show) {
		return {
			key,
			icon,
			children,
			label
		} as MenuItem;
	}
	return null
}

export default function RootLayout (): JSX.Element {
	const { user } : { user: IUser } = useAuth()

	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer },
	} = theme.useToken();

	return (
		<Layout style={{ minWidth: "100dvw", minHeight: "100dvh", padding: 0 }}>
			<Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
				{/* Logo and Header */}
				<SideMenu user={user}/>
			</Sider>
			<Layout>
				<Header style={{ textAlign: "center",padding: 0, background: colorBgContainer }} >
					<Typography.Title level={2}>
						Central Water Management
					</Typography.Title>
				</Header>
				<Content>
					<Outlet />
				</Content>
				<Footer style={{ textAlign: 'center' }}>CWM ©{ (new Date()).getFullYear() } Created by Euael and Sherif </Footer>
			</Layout>
		</Layout>
	);
};

function SideMenu({user} : { user: IUser | null}) {
	const show: boolean = user != null && user.token != null
	const navigate: NavigateFunction = useNavigate()

	const items: MenuItem[] = [
		getItem('View Usage Data', '/', true, <PieChartOutlined />),
		getItem('Customer', 'sub1', show, <UserOutlined />, [
			getItem('View Customers', 'view-customers', show, <TeamOutlined />),
			getItem('Add Customer', 'add-customer', show, <PlusOutlined />),
		]),
		getItem('Devices', 'sub2', show, <PartitionOutlined />, [
			getItem('Show Devices', 'show-devices', show, <PlaySquareOutlined />),
			getItem('Add Device', 'add-device', show, <PlusOutlined />)
		]),
		getItem("Bills", "bills", show, <SolutionOutlined />),
		getItem('Setting', 'setting', show, <SettingOutlined />),
		getItem("Logout", "logout", show, <LogoutOutlined />),
		getItem("login", "auth/login", !show, <LoginOutlined />)
	];

	function handleMenuClick({ key }: { key: React.Key }) {
		navigate(key as string)
	}

	return (
		<Menu
			theme="dark"
			defaultSelectedKeys={['/']}
			mode="inline"
			items={items}
			onClick={handleMenuClick}
			selectedKeys={[window.location.pathname]}
		/>
	)
}
