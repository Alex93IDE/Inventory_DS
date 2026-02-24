import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';

@UseGuards(JwtAuthGuard)
@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}
  @Post('add')
  async create(@Body() body: CreateProductoDto, @Req() req: any) {
    const userId = req.user.userId;
    return await this.productoService.create(body, userId);
  }
  @Get()
  async findAll(@Req() req: any) {
    return this.productoService.findAll(req.user.userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.productoService.remove(id, req.user.userId);
  }
}
