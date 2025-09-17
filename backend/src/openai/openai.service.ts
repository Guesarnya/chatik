import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    defaultHeaders: {
      "Content-Type": "application/json; charset=utf-8",
    },
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
const toUtf8 = (str: string) =>
  Buffer.from(str, 'utf8').toString();

const completion = await this.openai.chat.completions.create({
  model: "gpt-4.1-mini",
  messages: [
    { role: "system", content: toUtf8("you are an assistant who writes short motivational letters") },
    { role: "user", content: toUtf8("Generate a short motivation (only motivation without introductory words, and write in Russian).") },
  ],
});


    const raw = completion.choices[0].message.content ?? 'No message';
    const formatted = this.markdownToHTML(raw);
console.log("RAW:", JSON.stringify(raw));

    return { message: formatted };
  }

  async getRecipe() {
const toUtf8 = (str: string) =>
  Buffer.from(str, 'utf8').toString();

const completion = await this.openai.chat.completions.create({
  model: "gpt-4.1-mini",
  messages: [
    { role: "system", content: toUtf8("You are an assistant who writes prescriptions. (it is advisable not to repeat yourself)") },
    { role: "user", content: toUtf8("generate a recipe (only the recipe, immediate response in Russian)") },
  ],
});


    const raw = completion.choices[0].message.content ?? 'No message';
    const formatted = this.markdownToHTML(raw);

console.log("RAW:", JSON.stringify(raw));

    return { message: formatted };
  }


async getChatResponseWithFollowUp(userMessage: string, userId: string) {
  if (!userId) {
    console.error("userId is undefined or null");
    throw new Error("userId is required");
  }

  const user = await this.userRepository.findOne({ where: { unique_user_id: userId } });

  if (!user || !user.thread) {
    console.error("User or thread not found");
    throw new Error("User or thread not found");
  }

  const thread = user.thread;

  const bioData = `
    Имя: ${user.name || "не указано"}
    Пол: ${user.male || "не указан"}
    Возраст: ${user.age || "не указан"}
    Рост: ${user.weight || "не указан"}
    Вес: ${user.hight || "не указан"}
    Цель: ${user.point || "не указана"}
    Уровень активности: ${user.activity || "не указан"}
  `;

  const messagesPage = await this.openai.beta.threads.messages.list(thread);
  const messages = messagesPage.data || [];

const conversationMessages = [
  {
    role: "system",
    content: `Ты помощник по питанию.
- Отвечай только на русском языке. 
- В ответе давай подробный и дружелюбный ответ пользователю. 
- Всегда предлагай 2 follow-up вопроса, чтобы помочь продолжить диалог. 
- Формат follow-up:
  • "label" — короткий текст кнопки (до 4 слов, на русском).
  • "value" — полный follow-up вопрос от лица пользователя (от первого лица, на русском). Пример: "Я хочу рассчитать калории", "Мне интересно, сколько белка мне нужно".
- Никогда не пиши follow-up вопросы на английском языке.

?? Так же при общении учитывай данные пользователя:
${bioData}
`,
  },
    ...messages.reverse().map((msg) => {
      const content = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);
      const role = msg.role === "user" || msg.role === "assistant" ? msg.role : "user";
      return { role, content };
    }),
    { role: "user", content: userMessage },
  ];

  const completion = await this.openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: JSON.parse(JSON.stringify(conversationMessages)),
    user: user.unique_user_id,
    tools: [
      {
        type: "function",
        function: {
          name: "return_response",
          description: "Возвращает основной ответ и два follow-up вопроса.",
          parameters: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Основной ответ пользователю (на русском).",
              },
              followUpSuggestions: {
                type: "array",
                description: "Два follow-up вопроса на русском языке.",
                items: {
                  type: "object",
                  properties: {
                    label: {
                      type: "string",
                      description: "Короткий текст кнопки (до 4 слов, на русском).",
                    },
                    value: {
                      type: "string",
                      description: "Полный follow-up вопрос от лица пользователя (от первого лица, на русском).",
                    },
                  },
                  required: ["label", "value"],
                },
                minItems: 2,
                maxItems: 2,
              },
            },
            required: ["message", "followUpSuggestions"],
          },
        },
      },
    ],
    tool_choice: { type: "function", function: { name: "return_response" } },
  });

  const toolCall = completion.choices[0]?.message?.tool_calls?.[0];

  if (toolCall && toolCall.type === "function" && toolCall.function) {
    try {
      const parsed = JSON.parse(toolCall.function.arguments);

      const raw = parsed.message ?? "Нет ответа";
      const formatted = this.markdownToHTML(raw);

      const followUps = Array.isArray(parsed.followUpSuggestions) ? parsed.followUpSuggestions : [];

      try {
        await this.openai.beta.threads.messages.create(thread, {
          role: "user",
          content: userMessage,
        });

        await this.openai.beta.threads.messages.create(thread, {
          role: "assistant",
          content: formatted,
        });

        console.log("Message added to thread");
      } catch (error) {
        console.error("Error adding message to thread:", error);
      }

      return {
        message: formatted,
        followUps,
      };
    } catch (err) {
      console.error("Ошибка при разборе ответа функции.", err);
      return {
        message: "Ошибка при разборе ответа функции.",
        followUps: [],
      };
    }
  }

  return {
    message: "Ответ не получен.",
    followUps: [],
  };
}









}