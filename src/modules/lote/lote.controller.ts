import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoteService } from './lote.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';

@UseGuards(JwtAuthGuard)
@Controller('lote')
export class LoteController {
  constructor(private readonly loteService: LoteService) {}

  @Post('add')
  async create(@Body() body: CreateLoteDto, @Req() req: any) {
    const userId = req.user.userId;
    return await this.loteService.create(body, userId);
  }

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user.userId;
    return await this.loteService.findAll(userId);
  }

  @Patch(':lote_id')
  async update(
    @Param('lote_id') loteId: string,
    @Body() body: UpdateLoteDto,
    @Req() req: any,
  ) {
    return await this.loteService.update(loteId, body, req.user.userId);
  }

  @Delete(':lote_id')
  async remove(@Param('lote_id') loteId: string, @Req() req: any) {
    return await this.loteService.removeByLoteId(loteId, req.user.userId);
  }
}
