import { Controller, Get } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';

@Controller('motivation')
export class MotivationController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Get()
  async getMotivation() {
    return await this.openaiService.getMotivation();
  }
}
