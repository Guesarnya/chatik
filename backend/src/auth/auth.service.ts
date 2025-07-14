// import { BadRequestException, Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/prisma.service';
// import { AuthDto } from './dto/auth.dto';
// import { faker } from '@faker-js/faker';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class AuthService {
//   constructor(private prisma: PrismaService) {}

//   async register(dto: AuthDto) {
//     const oldUser = await this.prisma.user.findUnique({
//       where: { email: dto.email },
//     });

//     if (oldUser) throw new BadRequestException('Пользователь уже существует');

//     const hashedPassword = await bcrypt.hash(dto.password, 10);

//     const user = await this.prisma.user.create({
//       data: {
//         email: dto.email,
//         name: faker.person.firstName(),
//         avatarPath: faker.image.avatar(),
//         phone: faker.phone.number(),
//         password: hashedPassword,
//       },
//     });

//     return user;
//   }
// }
