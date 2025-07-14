import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { MotivationController } from './motivation/motivation.controller';
import { OpenaiService } from './openai/openai.service';
import { GetRecipeController } from './recipe/recipe.controller';
import { ChatController } from './chat/chat.controller';
// import { AuthModule } from './auth/auth.module';
import { DishController } from './dish/dish.controller';
import { DishService } from './dish/dish.service';
import { PrismaModule } from 'prisma/prisma.module';
import { HttpModule } from '@nestjs/axios'; 
import { RedactDishController } from './redact-dish/redact-dish.controller';
import { RedactDishService } from './redact-dish/redact.dish.service';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, HttpModule],
  controllers: [MotivationController, GetRecipeController, ChatController, DishController, RedactDishController],
  providers: [OpenaiService, DishService, RedactDishService],
})
export class AppModule {}
