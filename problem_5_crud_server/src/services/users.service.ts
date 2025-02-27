import { isEqual } from 'lodash';
import { hash } from 'bcrypt';
import { Between, ILike, In, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { IRequestUserGetList, User } from '@interfaces/users.interface';
import { UserEntity } from '@/entities/users.entity';
import { StatusCodes } from 'http-status-codes';
import { RoleEntity } from '@/entities/roles.entity';
import { CreateUserDto, UpdateUserDto, UserResponseDTO } from '@/dtos/users.dto';
import AppDataSource from '@/database/data-source';
import { logger } from '@/utils/logger';
import { LocalFileEntity } from '@/entities/localFiles.entity';

@Service()
export class UserService extends Repository<UserEntity> {
  public async findAllUser(query: IRequestUserGetList): Promise<UserResponseDTO> {
    const limit: number = query.limit || 10;
    const page = query.page || 1;
    const queryBuilder = UserEntity.createQueryBuilder('user').leftJoinAndSelect('user.roles', 'role').where('1=1');

    if (query.userName) {
      queryBuilder.andWhere('user.userName ILIKE :userName', { userName: `%${query.userName}%` });
    }
    if (query.email) {
      queryBuilder.andWhere('user.email ILIKE :email', { email: `%${query.email}%` });
    }
    if (query.roleId) {
      queryBuilder
        .andWhere(
          'user.id IN ' +
            queryBuilder
              .subQuery()
              .select('user_role.user_id')
              .from('tb_user_role', 'user_role')
              .where('user_role.role_id IN (:...roleIds)')
              .getQuery(),
        )
        .setParameter('roleIds', query.roleId.split(','));
    }
    if (query.createStartDate && query.createEndDate) {
      queryBuilder.andWhere('user.createdAt BETWEEN :startDate AND :endDate', {
        startDate: query.createStartDate,
        endDate: query.createEndDate,
      });
    } else if (query.createStartDate) {
      queryBuilder.andWhere('user.createdAt >= :startDate', { startDate: query.createStartDate });
    } else if (query.createEndDate) {
      queryBuilder.andWhere('user.createdAt <= :endDate', { endDate: query.createEndDate });
    }

    queryBuilder.andWhere('user.delete_yn = FALSE');

    if (query.sortBy) {
      const validSortFields = ['createdAt', 'userName', 'scores'];

      const sortCriteria = query.sortBy.split(',').map(item => item.trim());

      sortCriteria.forEach(sortItem => {
        const [field, order] = sortItem.split(' ');
        if (validSortFields.includes(field)) {
          const sortOrder = order && order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
          queryBuilder.addOrderBy(`user.${field}`, sortOrder);
        }
      });
    }

    const [result, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);
    return {
      users: result,
      pagination: {
        totalCount: total,
        currentPage: page,
        totalPages,
        nextPage: totalPages > page ? Number(page) + 1 : null,
        prevPage: page > 1 ? Number(page) - 1 : null,
      },
    };
  }

  public async findUserById(userId: number, prefixPath: string): Promise<User> {
    let urlImage = null;
    const findUser = await UserEntity.findOne({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        userName: true,
        createdAt: true,
        isEmailConfirmed: true,
        isPhoneNumberConfirmed: true,
        phoneNumber: true,
        scores: true,
        avatar: {
          id: true,
        },
      },
      relations: {
        posts: true,
        roles: true,
        avatar: true,
      },
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    const imageId = findUser.avatar?.id;
    if (imageId) {
      const file = await LocalFileEntity.findOne({ where: { id: imageId } });
      urlImage = `${prefixPath}/${file.path}`;
    }
    return { ...findUser, url: urlImage };
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
    const { roleIds = [], password, phoneNumber, userName, score } = userData;
    const findUser = await UserEntity.findOne({ where: { id: userId } });
    let findRole: RoleEntity[] = null;
    let newFile: LocalFileEntity = null;
    if (!findUser) throw new HttpException(StatusCodes.NOT_FOUND, `User ${userId} not found`);
    if (roleIds.length) {
      findRole = await RoleEntity.find({ where: { id: In(roleIds) } });
      if (!findRole.length) throw new HttpException(StatusCodes.NOT_FOUND, 'Role not found');
      findUser.roles = findRole;
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
      findUser.scores = score ?? findUser.scores;
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

  public async softDeleteUser(userId: number): Promise<UserEntity> {
    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const updateUser = await UserEntity.save({ ...findUser, deleteYn: true });
    return updateUser;
  }
}
