import { Controller, Post, Body } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly openaiService: OpenaiService) {}


  @Post('message')
  async getMessageWithFollowUp(@Body() body: { message: string }) {
    const response = await this.openaiService.getChatResponseWithFollowUp(body.message);
    return response; 
  }
}
