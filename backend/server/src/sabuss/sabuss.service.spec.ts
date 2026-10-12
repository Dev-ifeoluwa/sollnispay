import { Test, TestingModule } from '@nestjs/testing';
import { SabussService } from './sabuss.service';

describe('SabussService', () => {
  let service: SabussService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SabussService],
    }).compile();

    service = module.get<SabussService>(SabussService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
