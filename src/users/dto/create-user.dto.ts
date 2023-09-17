import { IsString, IsEmail, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly first_name: string;

  @IsString()
  readonly last_name: string;

  @IsEmail()
  readonly email: string;

  @IsEmail()
  readonly avatar?: string;

  @IsString()
  readonly password: string;
}
