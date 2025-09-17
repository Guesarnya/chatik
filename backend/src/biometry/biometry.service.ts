import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UpdateBiometryDto } from './dto/update-biometry.dto';

@Injectable()
export class BiometryService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async updateUserBiometrics(userId: string, biometrics: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOne({ where: { unique_user_id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    user.name = biometrics.name ?? user.name;
    user.age = biometrics.age ?? user.age;
    user.weight = biometrics.weight ?? user.weight;
    user.hight = biometrics.hight ?? user.hight;
    user.male = biometrics.male ?? user.male;
    user.point = biometrics.point ?? user.point;
    user.activity = biometrics.activity ?? user.activity;

    return this.userRepository.save(user);
  }

async getUserBiometrics(userId: string): Promise<Partial<User>> {
  const user = await this.userRepository.findOne({ where: { unique_user_id: userId } });
  if (!user) {
    return {
      name: null,
      age: null,
      weight: null,
      hight: null,
      male: null,
      point: null,
      activity: null,
    };
  }
  return {
    name: user.name,
    age: user.age,
    weight: user.weight,
    hight: user.hight,
    male: user.male,
    point: user.point,
    activity: user.activity,
  };
}


}
