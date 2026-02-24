import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { MovementType } from '@prisma/client';

export class CreateMovimientoDto {
  @IsString()
  sku: string;

  @IsEnum(MovementType)
  type: MovementType; // solo OUT en la práctica

  @IsInt()
  @Min(1)
  qty: number;

  @IsOptional()
  @IsString()
  channel?: string;

  @IsOptional()
  @IsString()
  order_ref?: string;

  @IsOptional()
  @IsString()
  lote_id?: string;
}
