import { IsOptional, IsString, IsInt, IsNumber } from 'class-validator';

export class UpdateLoteDto {
  @IsOptional()
  @IsString()
  lote_id?: string;

  @IsOptional()
  @IsString()
  purchase_date?: string;

  @IsOptional()
  @IsInt()
  qty_inicial?: number;

  @IsOptional()
  @IsNumber()
  unit_cost?: number;

  @IsOptional()
  @IsString()
  place?: string;

  @IsOptional()
  @IsString()
  order_ref?: string;
}
