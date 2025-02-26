import { isEqual } from 'lodash';
import { hash } from 'bcrypt';
import { In, Repository } from 'typeorm';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { User } from '@interfaces/users.interface';
import { UserEntity } from '@/entities/users.entity';
import { StatusCodes } from 'http-status-codes';
import { RoleEntity } from '@/entities/roles.entity';
import { CreateUserDto, UpdateUserDto } from '@/dtos/users.dto';
import AppDataSource from '@/database/data-source';
import { logger } from '@/utils/logger';
import { LocalFileEntity } from '@/entities/localFiles.entity';

@Service()
export class UserService extends Repository<UserEntity> {
  public async findAllUser(): Promise<User[]> {
    const users: User[] = await UserEntity.find({
      select: {
        id: true,
        email: true,
        userName: true,
        createdAt: true,
        isEmailConfirmed: true,
        isPhoneNumberConfirmed: true,
        phoneNumber: true,
        roles: true,
        scores: true,
        posts: true,
      },
      relations: {
        posts: true,
        roles: true,
      },
    });
    return users;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await UserEntity.findOne({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        userName: true,
        createdAt: true,
        isEmailConfirmed: true,
        isPhoneNumberConfirmed: true,
        phoneNumber: true,
        roles: true,
        scores: true,
        posts: true,
      },
      relations: {
        posts: true,
        roles: true,
      },
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(dto: CreateUserDto): Promise<UserEntity> {
    const { email, password, confirmPassword, roleIds } = dto;
    const findUser: User = await UserEntity.findOne({ where: { email } });
    const findRole = await RoleEntity.find({ where: { id: In(roleIds) } });
    if (!findRole.length) throw new HttpException(StatusCodes.NOT_FOUND, 'Role not found');
    if (findUser) throw new HttpException(409, `This email ${dto.email} already exists`);
    if (!isEqual(password, confirmPassword)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, `Confirm password not matching`);
    }
    const hashedPassword = await hash(dto.password, 10);
    const createUserData = await UserEntity.create({ ...dto, password: hashedPassword, roles: findRole }).save();
    return createUserData;
  }

  public async updateUser(userId: number, userData: UpdateUserDto, file: Express.Multer.File | undefined): Promise<UserEntity> {
    const { roleIds = [], password, phoneNumber, userName } = userData;
    const findUser = await UserEntity.findOne({ where: { id: userId } });
    let findRole: RoleEntity[] = null;
    let newFile: LocalFileEntity = null;
    if (!findUser) throw new HttpException(StatusCodes.NOT_FOUND, `User ${userId} not found`);

    if (roleIds.length) {
      findRole = await RoleEntity.find({ where: { id: In(roleIds) } });
      if (!findRole.length) throw new HttpException(StatusCodes.NOT_FOUND, 'Role not found');
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (file) {
        newFile = new LocalFileEntity();
        newFile.filename = file.originalname;
        newFile.path = file.path;
        newFile.mimetype = file.mimetype;
        const fileSaved = await queryRunner.manager.save(newFile);
        findUser.avatar = fileSaved;
      }

      findUser.phoneNumber = phoneNumber ?? findUser.phoneNumber;
      findUser.userName = userName ?? findUser.userName;
      if (password) {
        const hashedPassword = await hash(password, 10);
        findUser.password = hashedPassword;
      }

      const userSaved = await queryRunner.manager.save(findUser);

      await queryRunner.commitTransaction();

      return userSaved;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      logger.error('Transaction failed:', error);
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Transaction failed');
    } finally {
      await queryRunner.release();
    }
  }

  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await UserEntity.delete({ id: userId });
    return findUser;
  }
}
