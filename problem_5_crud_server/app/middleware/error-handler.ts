import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import CustomError from '../errors/custom-error'
import { StatusCodes } from 'http-status-codes'
export const errorHandlerMiddleware = (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .json({ msg: err.message })
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .send('Something went wrong try again later')
}
