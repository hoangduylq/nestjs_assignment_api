import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  usersRepository: any;
  constructor(
    @InjectRepository(User)
    private readonly feedPostRepository: Repository<User>,
  ) {}

  getAll(): Promise<User[]> {
    return this.usersRepository.find(); //Select * from user
  }

  async getOneByID(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOneByID(id);
      return user;
    } catch (err) {
      // hand error
      throw err;
    }
  }
  // creaateUser(name: string): Promise<User> {
  //   const newUser = this.usersRepository.create({ name }); //const newUser = new User(name);
  //   return this.usersRepository.save(newUser);
  // }
  // updateUser(id:name, name:string):
}
