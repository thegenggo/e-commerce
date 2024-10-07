import { Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';

@Controller()
@ApiTags('Checkout')
@ApiBearerAuth()
export class CheckoutController {
    constructor(private readonly checkoutService: CheckoutService) {}

    @Post('checkout')
    checkout(@Req() req) {
        return this.checkoutService.checkout(req.user.sub);
    }
}
