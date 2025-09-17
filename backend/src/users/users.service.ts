import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import OpenAI from 'openai';


@Injectable()
export class UsersService {
  private openai: OpenAI;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  private async createThreadFromOpenAI(): Promise<string> {
    try {
      const thread = await this.openai.beta.threads.create();
      return thread.id;
    } catch (error) {
      console.error('Error creating thread:', error);
      throw new Error('Error creating thread');
    }
  }

async createOrUpdateUser(userId: string): Promise<User> {
  console.log('Received userId:', userId);
  if (!userId) {
    throw new Error('userId is required');
  }

  let user = await this.userRepository.findOne({ where: { unique_user_id: userId } });

  if (!user) {
    user = new User();
    user.unique_user_id = userId;
    user = await this.userRepository.save(user);
  }

  return user;
}

async createThread(userId: string): Promise<User> {
  const user = await this.userRepository.findOne({ where: { unique_user_id: userId } });

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.thread) {
    const newThreadId = await this.createThreadFromOpenAI();
    user.thread = newThreadId;
    await this.userRepository.save(user);
  }

  return user;
}



}
