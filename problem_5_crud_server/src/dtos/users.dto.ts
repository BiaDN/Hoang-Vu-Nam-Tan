import { UserEntity } from '@/entities/users.entity';
import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, IsPhoneNumber, IsNotEmptyObject, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(32)
  public password: string;

  @IsString()
  @IsNotEmpty()
  public userName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(32)
  public confirmPassword: string;

  @IsNotEmpty()
  @IsPhoneNumber('VN')
  public phoneNumber: string;

  @IsNotEmpty()
  public roleIds: number[];
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(9)
  @MaxLength(32)
  public password: string;

  @IsString()
  @IsOptional()
  public userName: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  public phoneNumber: string;

  @IsOptional()
  public roleIds: number[];
}

export class UserRequestDTO {
  public limit: number;
  public page: number;
}

export class UserResponseDTO {
  public users: UserEntity[];
  public pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    nextPage: number;
    prevPage: number;
  };
}
