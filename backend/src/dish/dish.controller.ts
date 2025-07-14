import { Controller, Get } from '@nestjs/common';
import { DishService } from './dish.service';

@Controller('dishes')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Get()
  async findAll() {
    const dishes = await this.dishService.findAll();
    return dishes.map(dish => ({
      id: dish.id,
      name: dish.dish_name,
      kcal: dish.calories,
      protein: dish.belki,
      fat: dish.zhiri,
      carbs: dish.uglevodi,
      weight: dish.weight,
      image: `https://xn--d1arx6a.xn--p1ai/api/public/${dish.path_image}`, // ✅ вот правильно
    }));
  }
}
