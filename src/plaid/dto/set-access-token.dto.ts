import { IsString } from 'class-validator';

export class SetAccessTokenDto {
  @IsString()
  readonly public_token: string;
}
