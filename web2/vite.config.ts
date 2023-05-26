import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dns from 'dns'

 dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild}) => {
	if (command === 'serve') { // dev specific config
		return {
			plugins: [react()],
			server: {
				host: "localhost",
				port: 3017
			}
		}
	} else { // build specific config
		return {
			plugins: [react()],
			server: {

			}
		}
	}
})
