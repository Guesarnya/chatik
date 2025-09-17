import { Injectable } from '@nestjs/common';
import { TestDish } from './entities/testdish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TestDishService {
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
}

