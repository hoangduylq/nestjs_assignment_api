import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _repository: Repository<User>,
  ) {}

  getAll(): Promise<User[]> {
    return this._repository.find();
  }

  async getOneByID(id: string): Promise<User> {
    try {
      const user = await this._repository.findOne(id);
      return user;
    } catch (err) {
      throw err;
    }
  }
}
