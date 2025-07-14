import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { URLSearchParams } from 'url';

@Injectable()
export class RedactDishService {
  constructor(private readonly httpService: HttpService) {}

  async forwardUpdate(
    card_id: number,
    belki: number,
    zhiri: number,
    uglevodi: number,
    kkal: number
  ) {
    const baseUrl = 'https://xn--d1arx6a.xn--p1ai/api/edit_card';
    const params = new URLSearchParams({
      card_id: card_id.toString(),
      belki: belki.toString(),
      zhiri: zhiri.toString(),
      uglevodi: uglevodi.toString(),
      kkal: kkal.toString(),
    });

    const url = `${baseUrl}?${params.toString()}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0',
            Accept: '*/*',
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new Error('Не удалось обновить данные карточки блюда');
    }
  }

  // 👉 ДОБАВЬ ЭТО
  async getCard(card_id: number) {
    const baseUrl = 'https://xn--d1arx6a.xn--p1ai/api/get_card';
    const params = new URLSearchParams({
      card_id: card_id.toString(),
    });

    const url = `${baseUrl}?${params.toString()}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0',
            Accept: '*/*',
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw new Error('Не удалось получить данные карточки блюда');
    }
  }

    async deleteCard(card_id: number) {
    const baseUrl = 'https://xn--d1arx6a.xn--p1ai/api/delete_card';
    const params = new URLSearchParams({ card_id: card_id.toString() });
    const url = `${baseUrl}?${params.toString()}`;

    try {
        const response = await firstValueFrom(
        this.httpService.get(url, {
            headers: {
            'User-Agent': 'Mozilla/5.0',
            Accept: '*/*',
            },
        }),
        );
        return response.data;
    } catch (error) {
        throw new Error('Не удалось удалить карточку блюда');
    }
    }

}
