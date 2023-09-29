import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
export class PlaidAccount {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  mask: string;

  @IsString()
  type: string;

  @IsString()
  subtype: string;

  @IsString()
  @IsOptional()
  verification_status?: string;

  @IsString()
  @IsOptional()
  class_type?: string;
}
export class SetAccessTokenDto {
  @IsString()
  readonly public_token: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlaidAccount)
  readonly accounts: PlaidAccount[];
}
