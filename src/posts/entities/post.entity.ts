import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Post {
  @ApiProperty({ description: 'Unique identifier for the post' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Title of the post' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Content of the post' })
  @Column({ type: 'text', nullable: true })
  content: string;

  @ApiProperty({ description: 'Summary of the post' })
  @Column({ nullable: true })
  summary: string;

  @ApiProperty({ description: 'Cover image URL of the post' })
  @Column({ length: 800, name: 'cover_image', nullable: true })
  coverImage: string;

  @ApiProperty({ description: 'Indicates if the post is a draft' })
  @Column({ type: 'boolean', default: true, name: 'is_draft' })
  isDraft: boolean;

  @ApiProperty({ description: 'Timestamp when the post was created' })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp when the post was last updated' })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Category, (category) => category.posts)
  @JoinTable({
    name: 'rel_post_categories',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];
}
