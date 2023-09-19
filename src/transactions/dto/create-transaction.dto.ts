import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsInt()
  readonly wallet_id: number;

  @IsInt()
  readonly category_id: number;

  @IsNumber()
  readonly amount_in_usd: number;

  @IsString()
  @IsOptional()
  readonly transacted_at: string;
}
