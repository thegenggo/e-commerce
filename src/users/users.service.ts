import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, User } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

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
    return this.prisma.user.update({
      where: { 
        id: id, 
      },
      data: {
        password: newPassword,
      },
    });
  }

  async setNewProductNotification(id: number, state: boolean) {
    return this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        newProductNotification: state,
      },
      select: {
        newProductNotification: true,
      }
    })
  }

  async sendNewProductNotification(product: Product) {
    const subscribeUsers = await this.prisma.user.findMany({
      where: {
        newProductNotification: true
      }
    });
    const result = subscribeUsers.map(async (subscribeUser: User) => {
      try {
        await this.mailerService.sendMail({
            to: subscribeUser.email,
            from: "E-commerce",
            subject: "E-commerce have new product",
            html: 
                `<h1>${product.productName}</h1>
                <p>${product.description ? product.description : ""}</p>
                <p>${product.price} $</p>`
        })
        console.log(`Successfully sent new product notification to ${subscribeUser.email}`);
        return true;
      } catch(error) {
        console.error(error);
        return false;
      }
    })
    return result;
  }
}
