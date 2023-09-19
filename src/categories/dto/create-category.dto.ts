import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { TransactionType } from '../entities/category.entity';

export class CreateCategoryDto {
  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  readonly name: string;

  @IsInt()
  readonly group_id: number;

  @IsEnum(TransactionType)
  readonly transaction_type: TransactionType;
}
