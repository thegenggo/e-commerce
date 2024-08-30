import {
  Body,
  Request,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('register')
  @ApiCreatedResponse({ type: UserEntity })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto.email, signUpDto.username, signUpDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOkResponse({ type: UserEntity })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
