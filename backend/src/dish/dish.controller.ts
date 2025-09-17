import { Controller, Delete, Get, Query } from '@nestjs/common';
import { DishService } from './dish.service';

@Controller('dishes')
export class DishController {
  constructor(private readonly DishService: DishService) {}


  @Get()
  async getDishes(@Query('user_id') userId: string) {

    return this.DishService.findByUser(userId);
  }

  @Delete()
  async deleteDish(@Query('dish_id') dishId: number) {
    return this.DishService.deleteDish(dishId)
  }
}
