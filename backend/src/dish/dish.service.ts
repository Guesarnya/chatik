import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DishService {
  constructor(private readonly httpService: HttpService) {}

  async findAll() {
    const userId = 475776712;

    const response: AxiosResponse = await firstValueFrom(
      this.httpService.get(`https://xn--d1arx6a.xn--p1ai/api/get_user?user_id=${userId}`)
    );

    const dishes = response.data; // это уже массив!
    return dishes;
  }
}
