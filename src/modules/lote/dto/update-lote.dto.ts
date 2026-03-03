import { IsOptional, IsString, IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateLoteDto {
  @IsOptional()
  @IsString()
  lote_id?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The purchase date' })
  purchase_date?: string;

  @IsOptional()
  @IsInt()
  @ApiProperty({ description: 'The initial quantity' })
  qty_inicial?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'The unit cost' })
  unit_cost?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The place' })
  place?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The order reference' })
  order_ref?: string;
}
