import './App.css'
import { JSX } from "react"
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from 'react-router-dom'
import Home from "./pages/Home.tsx";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route>

			<Route path='/'>
				<Route index element={<Home />} />
			</Route>

		</Route>
	)
)

function App(): JSX.Element {

	return (
		<RouterProvider router={router} />
	)
}

export default App
