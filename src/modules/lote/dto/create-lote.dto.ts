import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsOptional,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateLoteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The lote id' })
  lote_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The producto id' })
  productoId: string;

  @IsString()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'purchase_date must be MM-DD-YYYY',
  })
  @ApiProperty({ description: 'The purchase date' })
  purchase_date: string;

  @IsInt()
  @IsPositive()
  @ApiProperty({ description: 'The initial quantity' })
  qty_inicial: number;

  @IsPositive()
  @ApiProperty({ description: 'The unit cost' })
  unit_cost: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The place' })
  place?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The order reference' })
  order_ref?: string;
}
