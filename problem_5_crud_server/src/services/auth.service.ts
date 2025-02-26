import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { SECRET_KEY } from '@config';
import { HttpException } from '@/exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { UserEntity } from '@/entities/users.entity';
import { SignUpDTO } from '@/dtos/auth.dto';
import { isEqual } from 'lodash';
import { StatusCodes } from 'http-status-codes';
import { RoleEntity } from '@/entities/roles.entity';

const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: user.id };
  const secretKey: string = SECRET_KEY;
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
};

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
};

@Service()
export class AuthService extends Repository<UserEntity> {
  public async signup(dto: SignUpDTO): Promise<User> {
    const { email, password, confirmPassword } = dto;
    const findUser: User = await UserEntity.findOne({ where: { email } });
    const userRole = await RoleEntity.findOne({ where: { id: 2 } }); // Role user
    if (!userRole) throw new HttpException(409, 'Role USER not found');
    if (findUser) throw new HttpException(409, `This email ${dto.email} already exists`);
    if (!isEqual(password, confirmPassword)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, `Confirm password not matching`);
    }
    const hashedPassword = await hash(dto.password, 10);
    const createUserData: User = await UserEntity.create({ ...dto, password: hashedPassword, roles: [userRole] }).save();
    return createUserData;
  }

  public async login(userData: User): Promise<{ cookie: string; findUser: User }> {
    const findUser: User = await UserEntity.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password not matching');

    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);

    return { cookie, findUser };
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }
}
