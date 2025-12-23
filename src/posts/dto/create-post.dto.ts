import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Title of the post' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Content of the post' })
  content: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Summary of the post' })
  summary: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Cover image URL of the post' })
  coverImage?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  @ApiProperty({
    description: 'Array of category IDs associated with the post',
  })
  categoryIds?: number[];
}
