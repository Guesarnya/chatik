import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  private markdownToHTML(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/__(.*?)__/g, '<u>$1</u>')
      .replace(/~~(.*?)~~/g, '<s>$1</s>')
      .replace(/\n/g, '<br/>');
  }


  async getMotivation() {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Ты помощник, который пишет мотивации' },
        { role: 'user', content: 'Сгенерируй короткую мотивацию (пиши сразу ответ)' },
      ],
    });

    const raw = completion.choices[0].message.content ?? 'No message';
    const formatted = this.markdownToHTML(raw);

    return { message: formatted };
  }

  async getRecipe() {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Ты помощник, который пишет рецепты' },
        { role: 'user', content: 'сгенерируй рецепт (только рецепт, сразу ответ)' },
      ],
    });

    const raw = completion.choices[0].message.content ?? 'No message';
    const formatted = this.markdownToHTML(raw);

    return { message: formatted };
  }

  async getChatResponseWithFollowUp(userMessage: string) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Ты помощник, который отвечает пользователю и предлагает follow-up вопросы.',
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      tools: [
        {
          type: 'function',
          function: {
            name: 'return_response',
            description: 'Возвращает основной ответ и до двух follow-up вопросов.',
            parameters: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Основной ответ на сообщение пользователя.',
                },
                followUpSuggestions: {
                  type: 'array',
                  description: 'До двух follow-up вопросов.',
                  items: {
                    type: 'object',
                    properties: {
                      label: {
                        type: 'string',
                        description: 'Короткий текст кнопки (до 4 слов).',
                      },
                      value: {
                        type: 'string',
                        description: 'Полный follow-up вопрос.',
                      },
                    },
                    required: ['label', 'value'],
                  },
                  maxItems: 2,
                },
              },
              required: ['message'],
            },
          },
        },
      ],
      tool_choice: { type: 'function', function: { name: 'return_response' } },
    });

    const toolCall = completion.choices[0]?.message?.tool_calls?.[0];

    if (toolCall?.function?.arguments) {
      try {
        const parsed = JSON.parse(toolCall.function.arguments);

        const raw = parsed.message ?? 'Нет ответа';
        const formatted = this.markdownToHTML(raw);
        const followUps = Array.isArray(parsed.followUpSuggestions)
          ? parsed.followUpSuggestions
          : [];

        return {
          message: formatted,
          followUps,
        };
      } catch (err) {
        return {
          message: 'Ошибка при разборе ответа функции.',
          followUps: [],
        };
      }
    }

    return {
      message: 'Ответ не получен.',
      followUps: [],
    };
  }
}
