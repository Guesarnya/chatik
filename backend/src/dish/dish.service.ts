import { Injectable } from '@nestjs/common';
import { TestDish } from '../testdish/entities/testdish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(TestDish)
    private dishesRepository: Repository<TestDish>,
  ) {}

  async findByUser(userId: string): Promise<TestDish[]> {
    return this.dishesRepository.find({
      where: { user: { unique_user_id: userId } },
      relations: ['user'],
    });
  }


  async deleteDish(dishId: number): Promise<void> {
    const dish = await this.dishesRepository.findOne({
      where: { id: dishId },
    });

    if (!dish) {
      throw new Error('Блюдо не найдено');
    }
    await this.dishesRepository.remove(dish);
  }

}

