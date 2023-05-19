import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {ChakraProvider, extendTheme} from "@chakra-ui/react";

const theme = extendTheme({
	colors: {
		brand: {
			100: "#f7fafc",
			900: "#1a202c",
			800: "#2d3748",
			700: "#4a5568"
		},
	},
	fonts: {
		heading: `"Eczar", "sans-serif"`,
		body: `"Akshar", "sans-serif"`,
		button: `"Bungee", "sans-serif"`
	}
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<App />
		</ChakraProvider>
	</React.StrictMode>,
)
