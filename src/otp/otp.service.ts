import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager'
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import { Role } from 'src/auth/role/role.enum';

@Injectable()
export class OtpService {
    constructor(
        private readonly mailerService: MailerService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async sendOtp(
        user: { sub: number, username: string, role: Role, email: string }
    ) {
        const secret = speakeasy.generateSecret({ length: 20 }).base32;
        const otp = speakeasy.totp({
            secret: secret,
            encoding: "base32",
            step: 300,
        });

        console.log("User: ", user);

        const redisKey = `otp:${user.sub}`;

        await this.cacheManager.set(
            redisKey,
            JSON.stringify({
                secret: secret,
                createAt: Date.now(),
            }),
            300000,
        )
        
        try {
            await this.mailerService.sendMail({
                to: user.email,
                from: "E-commerce",
                subject: "OTP (One-Time Password)",
                html: 
                    `<h1>Please confirm your OTP</h1>
                    <p>Here is your OTP code: ${otp}</p>`
            })
            return { message: `The OTP has been sent to the email: ${user.email}` }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async verifyOtp(
        user: { sub: number, username: string, role: Role, email: string, exp: number },
        otp: string,
    ) {
        const redisKey = `otp:${user.sub}`;
        const otpCache: string = await this.cacheManager.get(redisKey);

        if(!otpCache) return false;

        const otpData = JSON.parse(otpCache);

        if(!otpData) return false;

        const isVerified = speakeasy.totp.verify({ // ตรวจสอบ token ว่าถูกต้องหรือไม่ โดยใช้ secret ที่เก็บไว้ใน redis
            secret: otpData.secret,
            encoding: "base32",
            token: otp,
            step: 300,
            window: 2,
        });

        if(isVerified) {
            await this.cacheManager.del(redisKey);
            await this.cacheManager.set(`session:${user.sub}`, { status: true, exp: user.exp}, 0);
            return true;
        } else {
            return false;
        }
    }
}
