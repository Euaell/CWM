import { createContext , ReactNode, useEffect, useState } from "react"

export interface IUser {
	_id: string,
	Name: string,
	Email: string,
	Phone: string,
	Role: string,
	token: string | null
}

const getFreshUser = (): IUser => {
	return {
		_id: "",
		Name: "",
		Email: "",
		Phone: "",
		Role: "",
		token: null
	}
}

export const UserContext = createContext<{user: IUser, setUser: (user: IUser) => void}>({
	user: getFreshUser(),
	setUser: (newUser: IUser) => { newUser }
})

export function UserProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState(getFreshUser())

	useEffect(() => {
		const storedUser: string | null = localStorage.getItem('user')
		if (storedUser) {
			setUser(JSON.parse(storedUser))
		}
	}, [])

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{ children }
		</UserContext.Provider>
	)
}
