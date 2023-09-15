import { IsEmail } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  readonly email: string;
}
