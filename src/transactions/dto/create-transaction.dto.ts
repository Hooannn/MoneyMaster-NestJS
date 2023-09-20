import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  wallet_id: number;

  @IsInt()
  category_id: number;

  @IsNumber()
  amount_in_usd: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  file_ids?: number[];

  @IsString()
  @IsOptional()
  transacted_at: string;
}
