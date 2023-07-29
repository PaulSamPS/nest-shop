import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShoppingCart } from './shopping-cart.model';
import { UserModule } from '@/modules/user';
import { ProductModule } from '@/modules/product';
import { ShoppingCartController } from './shopping-cart.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([ShoppingCart]),
    UserModule,
    ProductModule,
  ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
})
export class ShoppingCartModule {}
