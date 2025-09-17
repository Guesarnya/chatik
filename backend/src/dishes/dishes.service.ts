import { Injectable } from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { Dish } from './entities/dish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class DishesService {
  constructor(
    @InjectRepository(Dish)
    private dishesRepository: Repository<Dish>,
  ) {}

  async create(dishData: Dish): Promise<Dish> {
    const dish = this.dishesRepository.create(dishData);
    return this.dishesRepository.save(dish)
  }
}
