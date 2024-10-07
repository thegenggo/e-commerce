import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Injectable, CanActivate, ExecutionContext, Inject, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_NO_OTP_KEY } from './otp.decorator';

@Injectable()
export class OtpGuard implements CanActivate {
  private activate: boolean = true;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private reflector: Reflector,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    if (!this.activate) return true;

    const isNoOtp = this.reflector.getAllAndOverride<boolean>(IS_NO_OTP_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isNoOtp) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request['user'];
    const session: { status: boolean, exp: number  } = await this.cacheManager.get(`session:${user.sub}`);
    if(!session || Date.now()/1000 > session.exp) throw new UnauthorizedException('You must verify otp first.');
    return true;
  }
}