import express, { Request, Response, NextFunction } from "express"
import { ErrorHandler } from "./middlewares/ErrorHandler"
import Routes from "./routes";

import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"

import { join } from "path"
import { createWriteStream, WriteStream } from "fs";

const app = express()

const accessLogStream: WriteStream = createWriteStream(join(__dirname, "access.log"), { flags: "a" })

app.use(express.urlencoded({ extended: true }))
app.use(cors({
	origin: true,
	credentials: true,
	exposedHeaders: ["token"]
}))
app.use(express.json())
app.use(cookieParser())

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"))

if (process.env.NODE_ENV !== "production") {
	app.use(morgan(":remote-addr - :remote-user [:date[clf]] \":method :url HTTP/:http-version\" :status :res[content-length] \":referrer\" \":user-agent\"",
		{stream: accessLogStream}))
}

app.use("/api/v2/users", Routes.UserRoute)
app.use("/api/v2/devices", Routes.DeviceRoute)

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "Hello World!" })
})

app.use((req: Request, res: Response, next: NextFunction) => {
    return res.status(404).json({ message: "Not Found" })
})

app.use(ErrorHandler)

export default app
