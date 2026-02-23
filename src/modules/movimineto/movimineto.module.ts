import { Module } from '@nestjs/common';
import { MoviminetoService } from './movimineto.service';
import { MoviminetoController } from './movimineto.controller';

@Module({
  providers: [MoviminetoService],
  controllers: [MoviminetoController],
})
export class MoviminetoModule {}
