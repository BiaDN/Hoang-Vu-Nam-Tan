import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import pg from '@database';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import { StatusCodes } from 'http-status-codes';
import { User } from '@/interfaces/users.interface';
import { logger } from '@/utils/logger';
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

        if (findUser) {
          const roles = findUser.roles;

          console.log({ selfAccess, roles });

          if (selfAccess) {
            const { id } = req.params;
            if (Number(id) === findUser.id) {
              next();
            } else {
              if (roles.some(role => role.roleName === RoleType.ADMIN || role.roleName === RoleType.MODERATOR)) {
                next();
              } else {
                next(new HttpException(StatusCodes.FORBIDDEN, 'Only authenticated admin can access this endpoint'));
              }
            }
          } else {
            if (roles.some(role => role.roleName === RoleType.ADMIN || role.roleName === RoleType.MODERATOR)) {
              next();
            } else {
              next(new HttpException(StatusCodes.FORBIDDEN, 'Only authenticated admin can access this endpoint'));
            }
          }
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
