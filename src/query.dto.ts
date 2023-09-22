import { IsInt, IsOptional } from 'class-validator';

export class QueryDto {
  @IsInt()
  @IsOptional()
  offset?: number;

  @IsInt()
  @IsOptional()
  limit?: number;
}
