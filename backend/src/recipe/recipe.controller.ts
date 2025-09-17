import { Controller, Get, Header } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';

@Controller('recipe')
export class GetRecipeController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Get()
  @Header('Content-Type', 'application/json; charset=utf-8')
  async getRecipe() {
    return await this.openaiService.getRecipe();
  }
}
