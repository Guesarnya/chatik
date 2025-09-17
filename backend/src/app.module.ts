import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { MotivationController } from './motivation/motivation.controller';
import { OpenaiService } from './openai/openai.service';
import { GetRecipeController } from './recipe/recipe.controller';
import { ChatController } from './chat/chat.controller';
import { DishController } from './dish/dish.controller';
import { DishService } from './dish/dish.service';
import { HttpModule } from '@nestjs/axios'; 
import { RedactDishController } from './redact-dish/redact-dish.controller';
import { RedactDishService } from './redact-dish/redact.dish.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { DishesController } from './dishes/dishes.controller';
import { DishesService } from './dishes/dishes.service';
import { Dish } from './dishes/entities/dish.entity';
import { TestDishController } from './testdish/testdish.controller';
import { TestDishService } from './testdish/testdish.service';
import { TestDish } from './testdish/entities/testdish.entity'
import { ThreadModule } from './thread/thread.module';
import { ThreadController } from './thread/thread.controller';
import { ThreadService } from './thread/thread.service';
import { BiometryModule } from './biometry/biometry.module';
import { BiometryController } from './biometry/biometry.controller';
import { BiometryService } from './biometry/biometry.service';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1',
      database: 'FoodTest',
      entities: [User, Dish, TestDish],
      synchronize: false,
      logging: true,
    }),
    TypeOrmModule.forFeature([User, Dish, TestDish]),
  ],
  controllers: [MotivationController, GetRecipeController, ChatController, DishController, RedactDishController, UsersController, DishesController, TestDishController, ThreadController, BiometryController ],
  providers: [OpenaiService, DishService, RedactDishService, UsersService, DishesService, TestDishService, ThreadService, BiometryService],
})
export class AppModule {}
