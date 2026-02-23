import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MoviminetoService } from './movimineto.service';
import { CreateMovimientoDto } from './dto/create-movimineto.dto';

@UseGuards(JwtAuthGuard)
@Controller('mov')
export class MoviminetoController {
  constructor(private readonly moviminetoService: MoviminetoService) {}

  @Post('add')
  async create(@Body() dto: CreateMovimientoDto, @Req() req) {
    const userId = req.user.userId;
    return await this.moviminetoService.create(dto, userId);
  }

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user.userId;
    return await this.moviminetoService.findAll(userId);
  }

  @Get(':id')
  async findByLote(@Param('id') loteId: string, @Req() req: any) {
    return this.moviminetoService.findByLote(loteId, req.user.userId);
  }
}
