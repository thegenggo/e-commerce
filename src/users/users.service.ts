import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  }

  async createUser(email: string, username: string, password: string): Promise<User | undefined> {
    return this.prisma.user.create({
      data: {
        email: email,
        username: username,
        password: password,
      },
    });
  }
}
