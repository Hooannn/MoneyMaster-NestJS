import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateWalletTypeDto {
  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  readonly name: string;

  @IsInt()
  readonly policy_id: number;
}
