import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout.tsx";
import NotFound from "./pages/NotFound.tsx";
import RootLayout from "./layouts/RootLayout.tsx";
import Logout from "./helper/Logout.tsx";
import Login from "./pages/Login.tsx";
import { UserProvider } from "./helper/UserProvider.tsx";
import Home from "./pages/Home.tsx";
import Authenticate from "./helper/Authenticate.tsx";
import Bills from "./pages/Bills.tsx";
import Setting from "./pages/Setting.tsx";
import ShowDevices, { ChartView, TableView } from "./pages/devices/ShowDevices.tsx";
import AddDevice from "./pages/devices/AddDevice.tsx";
import AddCustomer from "./pages/customers/AddCustomer.tsx";
import ViewCustomers from "./pages/customers/ViewCustomers.tsx";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route>
			<Route path="auth" element={<AuthLayout />} >
				<Route path="login" element={<Login />} />
			</Route>

			<Route path='/' element={<RootLayout />}>
				<Route index element={<Home />} />
				<Route element={<Authenticate />}>
					<Route path="bills" element={<Bills />} />
					<Route path="setting" element={<Setting />} />

					{/*	Devices */}
					<Route path="show-devices" element={<ShowDevices />}>
						<Route index element={<TableView /> } />
						<Route path="chart-view" element={<ChartView />} />
					</Route>
					<Route path="add-device" element={<AddDevice />} />

					{/* Customers */}
					<Route path="add-customer" element={<AddCustomer />} />
					<Route path="view-customers" element={<ViewCustomers />} />
				</Route>

				<Route path='logout' element={<Logout />} />
			</Route>

			<Route path="*" element={<NotFound />} />
		</Route>
	)
)

function App() {

	return (
		<UserProvider>
			<RouterProvider router={router} />
		</UserProvider>

	)
}

export default App
