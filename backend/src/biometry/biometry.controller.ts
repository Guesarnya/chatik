import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BiometryService } from './biometry.service';
import { User } from '../users/entities/user.entity';

@Controller('biometry')
export class BiometryController {
  constructor(private readonly biometryService: BiometryService) {}

  @Post('update')
  async updateUserBiometrics(@Body() body: { userId: string; biometrics: Partial<User> }) {
    const { userId, biometrics } = body;
    if (!userId || !biometrics) {
      throw new Error('userId and biometrics are required');
    }
    return this.biometryService.updateUserBiometrics(userId, biometrics);
  }

  @Get(':userId')
  async getUserBiometrics(@Param('userId') userId: string) {
    if (!userId || userId.trim() === '') {
      throw new Error('userId is required');
    }
    return this.biometryService.getUserBiometrics(userId);
  }
}
