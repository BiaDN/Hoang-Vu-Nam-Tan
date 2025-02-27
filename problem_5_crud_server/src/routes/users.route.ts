import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AdminMiddleware } from '@/middlewares/auth.middleware';
import upload from '@/middlewares/upload.middleware';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.user.getUsers);
    this.router.get(`${this.path}/:id(\\d+)`, AdminMiddleware(true), this.user.getUserById);
    this.router.post(`${this.path}`, AdminMiddleware(false), ValidationMiddleware(CreateUserDto), this.user.createUser);
    this.router.post(
      `${this.path}/:id(\\d+)`,
      AdminMiddleware(true),
      upload.single('file'),
      ValidationMiddleware(UpdateUserDto, true),
      this.user.updateUser,
    );
    this.router.delete(`${this.path}/:id(\\d+)`, AdminMiddleware(false), this.user.deleteUser);
    this.router.post(`${this.path}/delete/:id(\\d+)`, AdminMiddleware(false), this.user.softDeleteUser);
  }
}
