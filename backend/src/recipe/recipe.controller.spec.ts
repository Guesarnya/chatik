import { Test, TestingModule } from '@nestjs/testing';
import { GetRecipeController } from './recipe.controller';

describe('GetRecipeController', () => {
  let controller: GetRecipeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetRecipeController],
    }).compile();

    controller = module.get<GetRecipeController>(GetRecipeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
