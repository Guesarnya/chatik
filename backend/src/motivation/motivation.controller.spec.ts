import { Test, TestingModule } from '@nestjs/testing';
import { MotivationController } from './motivation.controller';

describe('MotivationController', () => {
  let controller: MotivationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MotivationController],
    }).compile();

    controller = module.get<MotivationController>(MotivationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
