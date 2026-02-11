import { Controller, Get } from '@nestjs/common';
import { LoteService } from './lote.service';

@Controller('lote')
export class LoteController {
  constructor(private readonly loteService: LoteService) {}

  @Get('test')
  async test() {
    return await this.loteService.test();
  }
}
