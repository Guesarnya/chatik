// redact.dish.service.ts
import { Injectable } from '@nestjs/common';
import { TestDish } from '../testdish/entities/testdish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RedactDishService {
  constructor(
    @InjectRepository(TestDish)
    private dishesRepository: Repository<TestDish>,
  ) {}

  // Метод для получения всех блюд пользователя
  async findByUser(userId: string): Promise<TestDish[]> {
    return this.dishesRepository.find({
      where: { user: { unique_user_id: userId } },
      relations: ['user'],
    });
  }

  // Метод для обновления блюда
  async updateDish(
    dishId: number,
    dishName: string,
    calories: number,
    belki: number,
    zhiri: number,
    uglevodi: number,
    weight: number,
    path_image: string,
  ): Promise<TestDish> {
    const dish = await this.dishesRepository.findOne({
      where: { id: dishId },
    });

    if (!dish) {
      throw new Error('Блюдо не найдено');
    }

    // Обновляем данные блюда
    dish.dish_name = dishName;
    dish.calories = calories;
    dish.belki = belki;
    dish.zhiri = zhiri;
    dish.uglevodi = uglevodi;
    dish.weight = weight;
    dish.path_image = path_image;

    // Сохраняем обновленное блюдо в БД
    return this.dishesRepository.save(dish);
  }
}
