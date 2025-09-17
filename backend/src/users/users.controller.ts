import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-or-update')
  async createOrUpdateUser(@Body() body: { userId: string }): Promise<User> {
    try {
      if (!body.userId || typeof body.userId !== 'string' || body.userId.trim() === '') {
        throw new Error('userId must be a non-empty string');
      }
      return await this.usersService.createOrUpdateUser(body.userId);
    } catch (error) {
      console.error('Error creating or updating user:', error);
      throw new Error('Failed to create or update user');
    }
  }

  @Post('create-thread')
  async createThread(@Body() body: { userId: string }): Promise<User> {
    try {
      if (!body.userId || typeof body.userId !== 'string' || body.userId.trim() === '') {
        throw new Error('userId must be a non-empty string');
      }
      return await this.usersService.createThread(body.userId);
    } catch (error) {
      console.error('Error creating thread:', error);
      throw new Error('Failed to create thread');
    }
  }

}
