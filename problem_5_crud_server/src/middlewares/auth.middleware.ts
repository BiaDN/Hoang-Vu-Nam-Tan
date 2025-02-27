import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { StatusCodes } from 'http-status-codes';
import { UserEntity } from '@/entities/users.entity';
import { RoleType } from '@/interfaces/roles.interface';

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
      const findUser = await UserEntity.findOne({
        where: { id },
        select: {
          id: true,
          email: true,
          roles: {
            id: true,
            roleName: true,
          },
        },
        relations: {
          roles: true,
        },
      });
      if (findUser) {
        req.user = findUser as unknown as UserEntity;
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

/**
 * @description AdminMiddleware: purpose is to authorize api for only admin to access
 * @param selfAccess: if true it will only allow the user to see its own things, if false then only the admin has the right to call
 */
export const AdminMiddleware =
  (selfAccess = false) =>
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const Authorization = getAuthorization(req);

      if (Authorization) {
        const { id } = (await verify(Authorization, SECRET_KEY)) as DataStoredInToken;
        const findUser = await UserEntity.findOne({
          where: { id },
          select: {
            id: true,
            email: true,
            roles: {
              id: true,
              roleName: true,
            },
          },
          relations: {
            roles: true,
          },
        });

        if (!findUser) {
          return next(new HttpException(StatusCodes.UNAUTHORIZED, 'Wrong authentication token'));
        }

        const { id: userId } = req.params;
        const roles = findUser.roles;
        const hasAdminAccess = roles.some(role => role.roleName === RoleType.ADMIN || role.roleName === RoleType.MODERATOR);

        if (selfAccess && Number(userId) === findUser.id) {
          return next();
        }

        return hasAdminAccess ? next() : next(new HttpException(StatusCodes.FORBIDDEN, 'Only authenticated admin can access this endpoint'));
      } else {
        next(new HttpException(StatusCodes.NOT_FOUND, 'Authentication token missing'));
      }
    } catch (error) {
      next(new HttpException(StatusCodes.UNAUTHORIZED, 'Wrong authentication token'));
    }
  };
