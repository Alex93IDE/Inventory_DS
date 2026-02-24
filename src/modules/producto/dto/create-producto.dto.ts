import { IsOptional, IsString } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  name: string;

  @IsString()
  sku: string;

  @IsOptional()
  @IsString()
  asin?: string;

  @IsOptional()
  @IsString()
  upc?: string;
}
