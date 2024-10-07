import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { OrdeStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CheckoutService {
    constructor(private readonly prisma: PrismaService) {}

    async checkout(userId: number) {
        const cartItems = await this.prisma.cart.findMany({
            where: {
                userId: userId,
            },
            include: {
                product: true,
            },
        });

        if(cartItems.length === 0) throw new BadRequestException(`No items in the cart`);

        return await this.prisma.$transaction(async (tx) => {
            for(const item of cartItems) {
                if(item.quantity > item.product.quantity) throw new InternalServerErrorException(`Doesn't have enough ${item.product.productName} to make an order`);

                await tx.product.update({
                    where: {
                        id: item.productId,
                    },
                    data: {
                        quantity: {
                            decrement: item.quantity,
                        }
                    }
                });

                await tx.order.create({
                    data: {
                        orderStatus: OrdeStatus.ORDER_PLACED,
                        productId: item.productId,
                        userId: item.userId,
                    }
                });

                await tx.cart.deleteMany({
                    where: {
                        userId: userId,
                    }
                });
            }

            return await tx.order.findMany({ where: { userId: userId } });
        });
    }
}
