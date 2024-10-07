import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createOrderDto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        orderStatus: createOrderDto.orderStatus,
        productId: createOrderDto.productId,
        userId: createOrderDto.userId,
      }
    });
  }

  findAll() {
    return this.prisma.order.findMany();
  }

  findUserOrders(userId: number) {
    return this.prisma.order.findMany({ where: { userId: userId } });
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
