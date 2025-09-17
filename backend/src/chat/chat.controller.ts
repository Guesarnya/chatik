import { Controller, Post, Body } from '@nestjs/common';
import { OpenaiService } from '../openai/openai.service';
import { UsersService } from '../users/users.service';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly openaiService: OpenaiService,
    private readonly usersService: UsersService,
  ) {}

@Post('message')
async getMessageWithFollowUp(@Body() body: { userId: string, message: string }) {
  const user = await this.usersService.createOrUpdateUser(body.userId);

  if (user && user.thread) {
    const response = await this.openaiService.getChatResponseWithFollowUp(body.message, body.userId);
    return response;
  }

  return {
    message: 'Пользователь не найден или не имеет thread.',
    followUps: [],
  };
}

}
