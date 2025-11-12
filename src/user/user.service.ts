import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.findOne(id);
    return user;
  }

  async create(body: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: body.email });
    if (user) {
      throw new BadRequestException(`Error creating user`);
    }
    const newUser = await this.userRepository.save(body);
    return newUser;
  }

  async update(id: string, body: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const updatedUser = this.userRepository.merge(user, body);
    return this.userRepository.save(updatedUser);
  }

  async delete(id: string): Promise<User> {
    const user = await this.findOne(id);
    await this.userRepository.delete(user.id);
    return user;
  }

  private async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: Number(id) },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}
