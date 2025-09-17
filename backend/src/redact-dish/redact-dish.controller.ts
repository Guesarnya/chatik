
import { Controller, Get, Put, Body, Param, Query } from '@nestjs/common';
import { RedactDishService } from './redact.dish.service';

@Controller('dishes')
export class RedactDishController {
  constructor(private readonly redactDishService: RedactDishService) {}

  // Получение всех блюд пользователя
  @Get()
  async getDishes(@Query('user_id') userId: string) {
    return this.redactDishService.findByUser(userId);
  }

  // Обновление данных блюда
  @Put(':id')
  async updateDish(
    @Param('id') dishId: number,
    @Body() body: {
      dish_name: string;
      calories: number;
      belki: number;
      zhiri: number;
      uglevodi: number;
      weight: number;
      path_image: string;
    },
  ) {
    const { dish_name, calories, belki, zhiri, uglevodi, weight, path_image } = body;

    return this.redactDishService.updateDish(
      dishId,
      dish_name,
      calories,
      belki,
      zhiri,
      uglevodi,
      weight,
      path_image,
    );
  }
}
