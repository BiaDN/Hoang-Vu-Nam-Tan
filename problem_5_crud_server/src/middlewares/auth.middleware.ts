import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import pg from '@database';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { StatusCodes } from 'http-status-codes';
import { User } from '@/interfaces/users.interface';
import { logger } from '@/utils/logger';

const getAuthorization = req => {
  const cookie = req.cookies['Authorization'];
  if (cookie) return cookie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { id } = (await verify(Authorization, SECRET_KEY)) as DataStoredInToken;
      console.log({ id, SECRET_KEY, Authorization })
      const { rows, rowCount } = await pg.query(`
        SELECT
          "email",
          "password"
        FROM
          users
        WHERE
          "id" = $1
      `, [id]);

      if (rowCount) {
        req.user = rows[0] as unknown as User;
        next();
      } else {
        next(new HttpException(StatusCodes.UNAUTHORIZED, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(StatusCodes.NOT_FOUND, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(StatusCodes.UNAUTHORIZED, 'Wrong authentication token'));
  }
};
