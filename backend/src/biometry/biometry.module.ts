import { Module } from '@nestjs/common';
import { BiometryService } from './biometry.service';
import { BiometryController } from './biometry.controller';

@Module({
  controllers: [BiometryController],
  providers: [BiometryService],
})
export class BiometryModule {}
