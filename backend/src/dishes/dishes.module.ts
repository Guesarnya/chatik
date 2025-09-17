import { Module } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { DishesController } from './dishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { User } from 'src/users/entities/user.entity'; // Импортируем User для связи

@Module({
  imports: [TypeOrmModule.forFeature([Dish, User])], // Подключаем репозитории для работы с Dish и User
  controllers: [DishesController],
  providers: [DishesService],
})
export class DishesModule {}
