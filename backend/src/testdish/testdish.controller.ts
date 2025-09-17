import { Controller, Get, Query } from '@nestjs/common';
import { TestDishService } from './testdish.service';

@Controller('dishes')
export class TestDishController {
  constructor(private readonly testDishService: TestDishService) {}


  @Get()
  async getDishes(@Query('user_id') userId: string) {

    return this.testDishService.findByUser(userId);
  }
}
