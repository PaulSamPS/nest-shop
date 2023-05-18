import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShoppingCart } from './shopping-cart.model';
import { UsersModule } from '@users';
import { ProductModule } from '@product';

@Module({
  imports: [
    SequelizeModule.forFeature([ShoppingCart]),
    UsersModule,
    ProductModule,
  ],
  providers: [ShoppingCartService],
})
export class ShoppingCartModule {}
