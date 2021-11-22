import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRespository: Repository<User>,
  ) {}

  private readonly users: any = [
    {
      userId: 1,
      username: 'hoangduy',
      password: 'hoangduy',
    },
    {
      userId: 2,
      username: 'hoangduy2',
      password: 'hoangduy2',
    },
  ];

  async findOne(username: string): Promise<any> {
    return this.users.find((user) => user.username === username);
  }

  async getOneById(id: number): Promise<User> {
    try {
      const user = await this.usersRespository.findOneOrFail(id);
      return user;
    } catch (error) {
      throw error.message;
    }
  }

  async findByUserNameOrEmail(
    params: Partial<{ username: string; email: string }>,
  ): Promise<User | undefined> {
    const queryBuilder = this.usersRespository.createQueryBuilder('user');

    if (params.email) {
      queryBuilder.orWhere('user.email =:email', { email: params.email });
    }

    if (params.username) {
      queryBuilder.orWhere('user.username =:username', {
        username: params.username,
      });
    }

    return queryBuilder.getOne();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findByUserNameOrEmail(createUserDto);
    if (user) {
      throw new ConflictException('Username Or Email already exists');
    }
    const newUser = this.usersRespository.create(createUserDto);
    return this.usersRespository.save(newUser);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<boolean> {
    const user = await this.getOneById(id);
    if (!user) return false;
    await this.usersRespository.update(id, updateUserDto);
    return true;
  }

  async deleteUser(id: number): Promise<boolean> {
    const user = await this.getOneById(id);
    if (!user) return false;

    await this.usersRespository.remove(user);
    return true;
  }
}
