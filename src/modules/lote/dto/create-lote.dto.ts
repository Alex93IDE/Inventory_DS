import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateLoteDto {
  @IsString()
  @IsNotEmpty()
  lote_id: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'purchase_date must be MM-DD-YYYY',
  })
  purchase_date: string;

  @IsInt()
  @IsPositive()
  qty_inicial: number;

  @IsPositive()
  unit_cost: number;

  @IsOptional()
  @IsString()
  place?: string;

  @IsOptional()
  @IsString()
  order_ref?: string;
}
