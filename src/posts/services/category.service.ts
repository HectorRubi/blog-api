import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';
import { Post } from '../entities/post.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  async getPosts(id: number): Promise<Post[]> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (!category) {
      throw new BadRequestException(`Category #${id} not found`);
    }
    return category.posts;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      return this.categoryRepository.save(category);
    } catch {
      throw new BadRequestException('Error creating category');
    }
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.preload({
      id,
      ...updateCategoryDto,
    });
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category #${id} not found`);
    }
  }
}
