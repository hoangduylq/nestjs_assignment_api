import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRespository: Repository<User>,
  ) {}

  async getAll(): Promise<User[]> {
    return await this.usersRespository.find();
  }

  async getAllUser(): Promise<User[]> {
    const users = await this.usersRespository.find();
    const resultUsers = [];
    users.forEach((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      resultUsers.push(result);
    });
    return resultUsers;
  }

  async findOne(username: string): Promise<any> {
    const users = await this.getAll();
    return users.find((user) => user.username === username);
  }

  async getOneById(id: string): Promise<User> {
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
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    newUser.password = hashedPassword;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = await this.usersRespository.save(newUser);

    return result;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<boolean> {
    const user = await this.getOneById(id);
    if (!user) return false;
    await this.usersRespository.update(id, updateUserDto);
    return true;
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.getOneById(id);
    if (!user) return false;

    await this.usersRespository.remove(user);
    return true;
  }
}
