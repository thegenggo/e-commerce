import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { OtpService } from './otp/otp.service';
import { VerifyOtpDto } from './otp/dto/verify-otp.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly otpService: OtpService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('send-otp')
  sendOtp(@Req() req) {
    const result = this.otpService.sendOtp(req.user);
    if(!result) {
      throw new InternalServerErrorException();
    }
    return result;
  }

  @Post('verify-otp')
  async verifyOtp(@Req() req, @Body() body: VerifyOtpDto) {
    const isVerified = await this.otpService.verifyOtp(req.user, body.otp);
    console.log("Is verified: ", isVerified);
    if(!isVerified) {
      throw new BadRequestException('OTP ไม่ถูกต้องหรือหมดอายุ');
    }
    return { message: "Verification is successful."}
  }
}
