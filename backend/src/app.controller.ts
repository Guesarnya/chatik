import { Controller, Get } from '@nestjs/common';
import { OpenaiService } from './openai/openai.service';

@Controller()
export class AppController {
  constructor(private readonly openaiService: OpenaiService) {}
}
