import { TError } from "app/type";
import { NextFunction, Request, Response } from "express";

import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

const { AccountSchema } = require("../models");

const config = process.env;

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token =
        req.body.token || req.query.token || req.headers["authorization"];
    // const refreshToken = req.headers["x-auth-token"]

    const tokenSplit = token?.split(" ")?.[1]
    if (!tokenSplit) {
        return res.status(StatusCodes.UNAUTHORIZED).send({ msg: "A token is required for authentication", status: StatusCodes.UNAUTHORIZED });
    }
    try {
        const decoded = jwt.verify(tokenSplit, process.env.TOKEN_KEY as string) as { userId: string };
        const { userId } = decoded;
        const account = await AccountSchema.findOne({ userId })
        // req.account = account
    } catch (err: unknown) {
        return res.status(StatusCodes.UNAUTHORIZED).send({ msg: (err as TError).message, status: StatusCodes.UNAUTHORIZED });
    }
    return next();
};

const verifyApiKey = async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers["x-api-key"];
    console.log(apiKey);
    if (!apiKey) {
        return res.status(StatusCodes.UNAUTHORIZED).send({ msg: "A api key is required for authentication", status: StatusCodes.UNAUTHORIZED });
    }
    if (apiKey !== process.env.apiKey) {
        return res.status(StatusCodes.UNAUTHORIZED).send({ msg: "Key not found", status: 401 });
    }
    return next();
};

module.exports = { verifyToken, verifyApiKey };