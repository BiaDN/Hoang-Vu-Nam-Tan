import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpDTO {
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
}

export class LoginDTO {
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  public password: string;
}
