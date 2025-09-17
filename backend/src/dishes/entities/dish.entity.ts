import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity'; // Импортируем сущность User

@Entity('dishes')
export class Dish {
  @PrimaryGeneratedColumn()
  id: number;

  // Здесь устанавливаем правильную связь по unique_user_id
  @ManyToOne(() => User, (user) => user.dishes)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'unique_user_id' })  // Ссылка на unique_user_id в User
  user: User;

  @Column('timestamp')
  date_act: Date;

  @Column('varchar', { length: 255 })
  dish_name: string;

  @Column('float')
  calories: number;

  @Column('float')
  belki: number;

  @Column('float')
  zhiri: number;

  @Column('float')
  uglevodi: number;

  @Column('float')
  weight: number;

  @Column('text')
  path_image: string;
}
