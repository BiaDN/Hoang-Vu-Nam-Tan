import { NextFunction, Request, Response } from 'express'

const logRequest = async (req: Request, res: Response, next: NextFunction) => {
    console.log({ body: req.body, header: req.headers, date: new Date() });
    return next();
};

export default logRequest