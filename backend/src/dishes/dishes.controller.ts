import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { Dish } from './entities/dish.entity';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Post()
  async create(@Body() dishData: Dish): Promise<Dish> {
    return this.dishesService.create(dishData);
  }
}
