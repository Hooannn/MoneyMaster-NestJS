import { IsString } from 'class-validator';

export class CreateCategoryGroupDto {
  @IsString()
  description?: string;

  @IsString()
  name: string;
}
