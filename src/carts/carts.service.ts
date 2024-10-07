import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartsService {
  constructor(private readonly prisma: PrismaService) {}

  async showUserCart(userId: number) {
    return this.prisma.cart.findMany({ where: { userId: userId } });
  }

  async findOne(userId: number, productId: number) {
    return this.prisma.cart.findUnique({
      where: {
        cartId: {
          userId: userId,
          productId: productId,
        }
      } 
    });
  }

  async addProductToCart(userId: number, productId: number) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if(!product) throw new NotFoundException("No this product id in database");
    await this.prisma.cart.upsert({
      where: {
        cartId: {
          userId: userId,
          productId: productId,
        }
      },
      update: {
        quantity: {
          increment: 1,
        }
      },
      create: {
        userId: userId,
        productId: productId,
        quantity: 1
      },
    });
    return this.prisma.cart.findMany({ where: { userId: userId } });
  }

  async removeProductFromCart(userId: number, productId: number) {
    await this.prisma.cart.delete({
      where: {
        cartId: {
          userId: userId,
          productId: productId,
        }
      }
    });
    return this.prisma.cart.findMany({ where: { userId: userId } });
  }

  async increaseProductQuantity(userId: number, productId: number) {
    await this.prisma.cart.update({
      where: {
        cartId: {
          userId: userId,
          productId: productId,
        }
      },
      data: {
        quantity: {
          increment: 1
        }
      }
    });
    return this.prisma.cart.findMany({ where: { userId: userId } })
  }

  async decreaseProductQuantity(userId: number, productId: number) {
    await this.prisma.$transaction(async (tx) => {
      const productInCart = await tx.cart.update({
        where: {
          cartId: {
            userId: userId,
            productId: productId,
          }
        },
        data: {
          quantity: {
            decrement: 1
          }
        }
      });
      console.log(productInCart);
      if(productInCart.quantity <= 0) {
        await tx.cart.delete({
           where: { 
            cartId: {
              userId: userId,
              productId: productId,
            }  
          }
        })
      }
    });
    return this.prisma.cart.findMany({ where: { userId: userId } })
  }
}
