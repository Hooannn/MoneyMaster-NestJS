import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryGroupDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  name: string;
}
