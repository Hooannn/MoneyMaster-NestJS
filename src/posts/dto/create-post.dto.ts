import { IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNumber()
  @IsString()
  readonly user_id: string | number;

  @IsNumber()
  @IsString()
  readonly category_id: string;

  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;

  @IsString()
  readonly thumbnail: string;
}
