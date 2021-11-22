import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  usersRepository: any;
  constructor(
    @InjectRepository(User)
    private readonly Repository: Repository<User>,
  ) {}

  getAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async getOneByID(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOneByID(id);
      return user;
    } catch (err) {
      throw err;
    }
  }
}
