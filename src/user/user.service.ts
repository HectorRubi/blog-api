import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';
import { Profile } from './entities/profile.entity';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    const user = await this.findOne(id);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async getProfile(id: number): Promise<Profile> {
    const user = await this.findOne(id);
    return user.profile;
  }

  async getPosts(id: number): Promise<Post[]> {
    const user = await this.userRepository.findOne({
      where: { id: Number(id) },
      relations: { profile: true, posts: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user.posts;
  }

  async create(body: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: body.email });
    if (user) {
      throw new BadRequestException(`Error creating user`);
    }
    const newUser = this.userRepository.create(body);
    const savedUser = await this.userRepository.save(newUser);
    return this.findOne(savedUser.id);
  }

  async update(id: number, body: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const updatedUser = this.userRepository.merge(user, body);
    return this.userRepository.save(updatedUser);
  }

  async delete(id: number): Promise<User> {
    const user = await this.findOne(id);
    await this.userRepository.delete(user.id);
    return user;
  }

  private async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: Number(id) },
      relations: { profile: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }
}
