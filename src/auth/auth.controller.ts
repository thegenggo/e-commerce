import {
  Body,
  Request,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { Response } from 'express';
import { FacebookOauthGuard } from './guards/facebook-oauth.guard';
import { Public } from './auth.decorator';
import { AccessTokenEntity } from './entities/access-token.entity';
import { NewPasswordEntity } from './entities/new-password.entity';
import { NoOtp } from 'src/otp/otp.decorator';

@Controller('auth')
@ApiTags('Authentication')
@NoOtp(true)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiCreatedResponse({ type: AccessTokenEntity, description: "Successfully create new account and return access token." })
  @ApiConflictResponse({ description: "Already have this username or email in the system." })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto.email, signUpDto.username, signUpDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  @ApiOkResponse({ type: AccessTokenEntity, description: "Successfully login and return access token." })
  @ApiBadRequestResponse({ description: "Username or password is incorrect." })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  @NoOtp(false)
  @ApiOkResponse({ type: NewPasswordEntity, description: "Successfully change password." })
  changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.sub, changePasswordDto.password);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  @Public()
  async googleAuth() {}


  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  @Public()
  async googleAuthCallback(@Request() req, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.signInOauth(req.user);

    res.cookie('access_token', token, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });

    console.log(token);

    return token;
  }

  @Get('facebook')
  @Public()
  @UseGuards(FacebookOauthGuard)
  async facebookAuth() {}


  @Get('facebook/callback')
  @UseGuards(FacebookOauthGuard)
  @Public()
  async facebookAuthCallback(@Request() req, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.signInOauth(req.user);

    res.cookie('access_token', token, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });

    console.log(token);

    return token;
  }
}
