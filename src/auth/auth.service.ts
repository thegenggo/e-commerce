import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, username: string, password: string): Promise<{ access_token: string } | undefined> {
    const existingUser = await this.usersService.findOne(username);
    
    if(existingUser) {
      throw new ConflictException("User already exists. Please login.");
    } else {
      const hashedpassword = await bcrypt.hash(password, 10);
      const newUser = await this.usersService.createUser(email, username, hashedpassword);
      const payload = { sub: newUser.id, username: newUser.username };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
  }

  async signIn(username: string, password: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    if (await !bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
