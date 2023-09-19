import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateWalletDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @IsOptional()
  readonly custom_image?: string;

  @IsString()
  @IsOptional()
  readonly currency_code?: string;

  @IsBoolean()
  @IsOptional()
  readonly is_active?: boolean;

  @IsNumber()
  readonly amount_in_usd: number;

  @IsInt()
  readonly wallet_type_id: number;

  @IsInt()
  readonly belongs_to: number;

  @IsInt()
  readonly wallet_policy_id: number;
}
