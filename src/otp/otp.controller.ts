import { Controller, Post, Req, Body, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OtpService } from './otp.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('OTP')
@ApiBearerAuth()
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

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
