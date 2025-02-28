import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { IRequestUserGetList, User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import { handleSuccessResponse } from '@/utils/handleResponse';
import { CreateUserDto, UpdateUserDto } from '@/dtos/users.dto';
import { UserEntity } from '@/entities/users.entity';

export class UserController {
  public user = Container.get(UserService);

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData = await this.user.findAllUser(req.query as IRequestUserGetList);
      res.status(200).json(handleSuccessResponse(findAllUsersData, 'findAll', 200));
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const prefixPath = `${req.protocol}:/${req.get('host')}`;
      const findOneUserData: User = await this.user.findUserById(userId, prefixPath);

      res.status(200).json(handleSuccessResponse(findOneUserData, 'findOne', 200));
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const createUserData: UserEntity = await this.user.createUser(userData);

      res.status(201).json(handleSuccessResponse(createUserData, 'created', 201));
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const userData: UpdateUserDto = req.body;
      const file = req.file;
      const updateUserData: UserEntity = await this.user.updateUser(userId, userData, file);

      res.status(200).json(handleSuccessResponse(updateUserData, 'updated', 200));
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const deleteUserData: User = await this.user.deleteUser(userId);

      res.status(200).json(handleSuccessResponse(deleteUserData, 'deleted', 200));
    } catch (error) {
      next(error);
    }
  };

  public softDeleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const deleteUserData: User = await this.user.softDeleteUser(userId);

      res.status(200).json(handleSuccessResponse(deleteUserData, 'softDeleted', 200));
    } catch (error) {
      next(error);
    }
  };
}
