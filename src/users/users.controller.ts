import { Controller, Post, Request, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { OtpGuard } from 'src/otp/otp.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(OtpGuard)
@Controller('users')
@ApiTags('User')
@ApiBearerAuth()
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('set-new-product-notification')
    setNewProductNotification(@Request() req, @Body() body) {
        return this.usersService.setNewProductNotification(req.user.sub, body.state)
    }
}
