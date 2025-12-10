import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  summary: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
