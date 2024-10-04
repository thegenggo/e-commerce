import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [PrismaModule,CacheModule.register()],
})
export class ProductsModule {}
