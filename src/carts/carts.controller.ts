import { Controller, Post, Body, Req, Get, Delete, Param, HttpException, NotFoundException, Patch } from '@nestjs/common';
import { CartsService } from './carts.service';
import { AddProductToCartDto } from './dto/add-product-to-cart.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('carts')
@ApiTags('Cart')
@ApiBearerAuth()
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  showUserCart(@Req() req) {
    return this.cartsService.showUserCart(req.user.sub);
  }

  @Post(':productId')
  addProductToCart(@Req() req, @Param('productId') productId: string) {
    return this.cartsService.addProductToCart(req.user.sub, +productId);
  }

  @Patch('increase-product-quantity/:productId')
  async increaseProductQuantity(@Req() req, @Param('productId') productId: string) {
    const product = await this.cartsService.findOne(req.user.sub, +productId);
    if(!product) throw new NotFoundException("No this product id in the cart");
    return this.cartsService.increaseProductQuantity(req.user.sub, +productId);
  }

  @Patch('decrease-product-quantity/:productId')
  async decreaseProductQuantity(@Req() req, @Param('productId') productId: string) {
    const product = await this.cartsService.findOne(req.user.sub, +productId);
    if(!product) throw new NotFoundException("No this product id in the cart");
    return this.cartsService.decreaseProductQuantity(req.user.sub, +productId);
  }

  @Delete(':productId')
  async removeProductFromCart(@Req() req, @Param('productId') productId: string) {
    const product = await this.cartsService.findOne(req.user.sub, +productId);
    if(!product) throw new NotFoundException("No this product id in the cart");
    return this.cartsService.removeProductFromCart(req.user.sub, +productId)
  }
}
