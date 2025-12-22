import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { Payload } from 'src/auth/models/payload.model';

@UseGuards(AuthGuard('jwt'))
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const user = req.user as Payload;
    const userId = user.sub;
    return await this.postsService.create(createPostDto, userId);
  }

  @Get()
  async findAll() {
    return await this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return await this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.delete(id);
  }
}
