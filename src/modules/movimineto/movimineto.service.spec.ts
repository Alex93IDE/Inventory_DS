import { Test, TestingModule } from '@nestjs/testing';
import { MoviminetoService } from './movimineto.service';

describe('MoviminetoService', () => {
  let service: MoviminetoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviminetoService],
    }).compile();

    service = module.get<MoviminetoService>(MoviminetoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
