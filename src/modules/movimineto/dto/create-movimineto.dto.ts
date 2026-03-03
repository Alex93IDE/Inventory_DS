import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { MovementType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
export class CreateMovimientoDto {
  @IsString()
  @ApiProperty({ description: 'The SKU' })
  sku: string;

  @IsEnum(MovementType)
  @ApiProperty({ description: 'The type of movement' })
  type: MovementType; // solo OUT en la práctica

  @IsInt()
  @Min(1)
  @ApiProperty({ description: 'The quantity' })
  qty: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The channel' })
  channel?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The order reference' })
  order_ref?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The lote id' })
  lote_id?: string;
}
