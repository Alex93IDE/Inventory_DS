import { Test, TestingModule } from '@nestjs/testing';
import { MoviminetoController } from './movimineto.controller';

describe('MoviminetoController', () => {
  let controller: MoviminetoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviminetoController],
    }).compile();

    controller = module.get<MoviminetoController>(MoviminetoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
