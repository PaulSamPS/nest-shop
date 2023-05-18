import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ShoppingCart } from './shopping-cart.model';
import { UsersService } from '@users';
import { ProductService } from '@product';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectModel(ShoppingCart)
    private readonly shoppingCartModel: typeof ShoppingCart,
    private readonly usersService: UsersService,
    private readonly productsService: ProductService,
  ) {}

  async findAll(userId: number | string): Promise<ShoppingCart[]> {
    return this.shoppingCartModel.findAll({ where: { userId } });
  }

  async add(addToCartDto: AddToCartDto) {
    const cart = new ShoppingCart();
    const user = this.usersService.findOne({
      where: { username: addToCartDto.username },
    });
    const product = await this.productsService.findOneByiD(
      addToCartDto.productId,
    );
  }
}
