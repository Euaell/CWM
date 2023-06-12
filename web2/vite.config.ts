import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dns from 'dns'

 dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild}) => {
	if (command === 'serve') { // dev specific config, allow for cookies to be set
		return {
			plugins: [react()],
			server: {
				host: (process.env.NODE_ENV === 'production' ? 'https://watermang-web.onrender.com/' : 'localhost'),
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
