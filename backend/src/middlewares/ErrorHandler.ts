import { Request, Response, NextFunction } from "express"

export const ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    if (res.headersSent) {
        return next(err)
    }
    res.status(500).send("Something went wrong")
}