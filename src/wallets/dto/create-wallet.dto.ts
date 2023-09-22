import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateWalletDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  custom_image?: string;

  @IsString()
  @IsOptional()
  currency_code?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsNumber()
  amount_in_usd: number;

  @IsInt()
  wallet_type_id: number;
}

export class AdminCreateWalletDto extends CreateWalletDto {
  @IsInt()
  belongs_to: number;
}
