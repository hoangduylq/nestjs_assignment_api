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
