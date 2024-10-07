import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Injectable, CanActivate, ExecutionContext, Inject, BadRequestException } from '@nestjs/common';

@Injectable()
export class OtpGuard implements CanActivate {
  private activate: boolean = false;
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    if (!this.activate) return true;
    const request = context.switchToHttp().getRequest();
    const user = request['user'];
    const session: { status: boolean, exp: number  } = await this.cacheManager.get(`session:${user.sub}`);
    if(!session || Date.now()/1000 > session.exp) throw new BadRequestException('You must verify otp first.');
    return true;
  }
}