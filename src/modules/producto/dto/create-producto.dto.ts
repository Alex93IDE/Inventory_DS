import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateProductoDto {
  @IsString()
  @ApiProperty({ description: 'The name of the product' })
  name: string;

  @IsString()
  @ApiProperty({ description: 'The SKU of the product' })
  sku: string;

  @IsOptional()
  @IsString()
  asin?: string;

  @IsOptional()
  @IsString()
  upc?: string;
}
