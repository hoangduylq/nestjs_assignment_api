import { IsDate } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ nullable: true, length: 100 })
  name: string;

  @Column({ nullable: false, length: 20 })
  username: string;

  @Column({ nullable: false, length: 100 })
  email: string;

  @Column({ nullable: false, type: 'varchar' })
  password?: string;

  @Column({ nullable: true, type: 'date' })
  @IsDate()
  birthday: string;
}
