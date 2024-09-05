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

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
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

  async changePassword(id: number, newPassword: string): Promise<any> {
    console.log("New password: ", newPassword);
    return this.prisma.user.update({
        where: { 
          id: id, 
        },
        data: {
          password: newPassword,
        },
    });
  }
}
