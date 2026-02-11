import { Module } from '@nestjs/common';
import { MoviminetoService } from './movimineto.service';

@Module({
  providers: [MoviminetoService]
})
export class MoviminetoModule {}
