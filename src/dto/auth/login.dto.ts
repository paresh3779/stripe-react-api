import { IsEmail, IsString, MinLength, IsBoolean, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
