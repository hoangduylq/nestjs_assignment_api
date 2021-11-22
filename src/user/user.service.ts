import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { from, Observable } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRespository: Repository<User>,
  ) {}

  // private readonly users: any = [
  //   {
  //     userId: 1,
  //     username: 'hoangduy',
  //     password: 'hoangduy',
  //   },
  //   {
  //     userId: 2,
  //     username: 'hoangduy2',
  //     password: 'hoangduy2',
  //   },
  // ];

  async findOne(username: string): Promise<any> {
    const user = await this.usersRespository.findOne({ username: username });
    return user;
  }

  async getOneById(id: number): Promise<User> {
    try {
      const user = await this.usersRespository.findOneOrFail(id);
      return user;
    } catch (error) {
      throw error.message;
    }
  }

  createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRespository.create(createUserDto);
    return this.usersRespository.save(newUser);
  }

  updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Observable<UpdateResult> {
    return from(this.usersRespository.update(id, updateUserDto));
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.getOneById(id);

    await this.usersRespository.remove(user);
    return user;
  }
}
