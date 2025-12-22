import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find({
      relations: ['user.profile', 'categories'],
    });
  }

  async findById(id: number): Promise<Post> {
    const post = await this.findOne(id);
    return post;
  }

  async create(body: CreatePostDto, userId: number): Promise<Post> {
    try {
      const post = await this.postRepository.save({
        ...body,
        user: { id: userId },
        categories: body.categoryIds?.map((id) => ({ id })),
      });
      return this.findOne(post.id);
    } catch {
      throw new BadRequestException('Error creating post');
    }
  }

  async update(id: number, body: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    const updated = this.postRepository.merge(post, body);
    return this.postRepository.save(updated);
  }

  async delete(id: number): Promise<Post> {
    const post = await this.findOne(id);
    await this.postRepository.delete(post.id);
    return post;
  }

  async getPostsByCategory(categoryId: number): Promise<Post[]> {
    const posts = await this.postRepository.find({
      where: { categories: { id: categoryId } },
      relations: ['user.profile'],
    });

    if (!posts) {
      throw new NotFoundException('No posts found for this category');
    }

    return posts;
  }

  private async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: Number(id) },
      relations: ['user.profile', 'categories'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }
}
