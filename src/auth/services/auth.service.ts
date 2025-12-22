import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../user/services/user.service';
import { User } from '../../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../models/payload.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.userService.findByEmail(username);
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Unauthorized');
    }

    return user;
  }

  generateToken(user: User): string {
    const payload: Payload = { sub: user.id };
    return this.jwtService.sign(payload);
  }
}
