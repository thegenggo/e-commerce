import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';

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
    if (!user) throw new BadRequestException("Username or password is incorrect.");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException("Username or password is incorrect.");
    }

    const payload = { sub: user.id, username: user.username, role: user.role, email: user.email };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signInOauth(user) : Promise<{ access_token: string }> {
    if (!user) throw new BadRequestException('Unauthenticated');

    let userExists: User =  await this.usersService.findOneByEmail(user.email);
    console.log(userExists);

    if (!userExists) {
      userExists = await this.usersService.createUser(user.email, null, null);
    }

    const payload = { sub: userExists.id, email: userExists.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async changePassword(userId: number, newPassword: string): Promise<{ message: string }> {
    console.log("New password: ", newPassword);
    const user = await this.usersService.changePassword(userId, await bcrypt.hash(newPassword, 10))
    console.log("user: ", user);
    return {
      message: "Successfully changed password."
    }
  }
}
