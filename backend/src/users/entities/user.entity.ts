import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Dish } from 'src/dishes/entities/dish.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar' })
  unique_user_id: string;

  @Column({ type: 'varchar', nullable: true })
  thread: string | null;

  @OneToMany(() => Dish, (dish) => dish.user)
  dishes: Dish[];

  @Column({ type: 'varchar', nullable: true })
  name: string | null;

  @Column({ type: 'int', nullable: true })
  age: number | null;

  @Column({ type: 'float', nullable: true })
  weight: number | null;

  @Column({ type: 'float', nullable: true })
  hight: number | null;

  @Column({ type: 'varchar', nullable: true })
  male: string | null;

  @Column({ type: 'varchar', nullable: true })
  point: string | null;

  @Column({ type: 'varchar', nullable: true })
  activity: string | null;
}
