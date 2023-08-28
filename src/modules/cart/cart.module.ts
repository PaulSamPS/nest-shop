import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cart } from './cart.model';
import { UserModule } from '@/modules/user';
import { ProductModule } from '@/modules/product';
import { CartController } from './cart.controller';

@Module({
  imports: [SequelizeModule.forFeature([Cart]), UserModule, ProductModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
