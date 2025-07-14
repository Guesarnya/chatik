import { Controller, Get } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';

@Controller('recipe')
export class GetRecipeController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Get()
  async getRecipe() {
    return await this.openaiService.getRecipe();
  }
}
