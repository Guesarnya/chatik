
import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { RedactDishService } from './redact.dish.service';

@Controller('api')
export class RedactDishController {
  constructor(private readonly redactDishService: RedactDishService) {}

  @Get('get_card')
  async getCard(@Query('card_id') cardId: string) {
    const id = parseInt(cardId);
    if (isNaN(id)) {
      throw new BadRequestException('Некорректный ID');
    }
    return await this.redactDishService.getCard(id);
  }

  @Get('edit_card')
  async editCard(
    @Query('card_id') cardId: string,
    @Query('belki') belki: string,
    @Query('zhiri') zhiri: string,
    @Query('uglevodi') uglevodi: string,
    @Query('kkal') kkal: string,
  ) {
    const id = parseInt(cardId);
    const b = parseFloat(belki);
    const j = parseFloat(zhiri);
    const u = parseFloat(uglevodi);
    const k = parseFloat(kkal);

    if ([id, b, j, u, k].some(n => isNaN(n))) {
      throw new BadRequestException('Некорректные параметры запроса');
    }

    return await this.redactDishService.forwardUpdate(id, b, j, u, k);
  }

  @Get('delete_card')
  async deleteCard(@Query('card_id') cardId: string) {
    const id = parseInt(cardId);
    if (isNaN(id)) {
      throw new BadRequestException('Некорректный ID');
    }
    return await this.redactDishService.deleteCard(id);
  }

}
