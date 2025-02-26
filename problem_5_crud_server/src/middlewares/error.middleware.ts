import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/httpException';
import { logger } from '@utils/logger';
import { StatusCodes } from 'http-status-codes';

export const ErrorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  try {
    const status: number = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const message: string = error.message || 'Something went wrong';

    logger.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};
