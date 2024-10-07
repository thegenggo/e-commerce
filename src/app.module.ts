import { Module } from '@nestjs/common';
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
import { OtpModule } from './otp/otp.module';
import { CartsModule } from './carts/carts.module';
import { CheckoutModule } from './checkout/checkout.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [AuthModule, OtpModule, UsersModule, ProductsModule,
    CacheModule.register({
      isGlobal: true,
    }),
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
    OtpModule,
    CartsModule,
    CheckoutModule,
    OrdersModule,
  ],
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
