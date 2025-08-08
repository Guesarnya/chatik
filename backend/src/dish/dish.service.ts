import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DishService {
  constructor(private readonly httpService: HttpService) {}

  async findAll() {
    const userId = 475776712;
    
    const { data } = await firstValueFrom(
      this.httpService.get<any>(`https://xn--d1arx6a.xn--p1ai/api/get_user?user_id=${userId}`)
    );

    return data.map(dish => ({
      id: dish.id,
      date_act: dish.date_act ? new Date(dish.date_act) : null,
      name: dish.dish_name,
      kcal: dish.calories,
      protein: dish.belki,
      fat: dish.zhiri,
      carbs: dish.uglevodi,
      weight: dish.weight,
      image: `https://xn--d1arx6a.xn--p1ai/api/public/${dish.path_image}`,
    }));
  }
}
