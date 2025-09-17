import { Controller, Get, Header } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';

@Controller('motivation')
export class MotivationController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Get()
  @Header('Content-Type', 'application/json; charset=utf-8')
  async getMotivation() {
    return await this.openaiService.getMotivation();
  }
}
