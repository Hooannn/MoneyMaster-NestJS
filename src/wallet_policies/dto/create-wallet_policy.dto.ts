import { IsOptional, IsString } from 'class-validator';

export class CreateWalletPolicyDto {
  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  readonly name: string;
}
