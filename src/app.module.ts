import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/role/roles.guard';
import { AuthGuard } from './auth/auth.guard';
import { OtpService } from './otp/otp.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [AuthModule, UsersModule, ProductsModule,
    CacheModule.register(),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    OtpService,
  ],
})
export class AppModule {}
