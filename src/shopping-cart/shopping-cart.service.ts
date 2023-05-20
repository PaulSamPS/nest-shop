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
    private shoppingCartModel: typeof ShoppingCart,
    private readonly usersService: UsersService,
    private readonly productsService: ProductService,
  ) {}

  async findAll(userId: number): Promise<ShoppingCart[]> {
    return this.shoppingCartModel.findAll({ where: { userId } });
  }

  async add(addToCartDto: AddToCartDto) {
    const cart = new ShoppingCart();
    const user = await this.usersService.findOne({
      where: { id: addToCartDto.userId },
    });
    const product = await this.productsService.findOneByiD(
      addToCartDto.productId,
    );

    cart.userId = user.id;
    cart.productId = product.id;
    cart.name = product.name;
    cart.price = product.price;
    cart.weight = product.weight;
    cart.in_stock = product.in_stock;
    cart.image = JSON.parse(product.images)[0].url;
    cart.total_price = product.price;

    return cart.save();
  }

  async updateCount(
    count: number,
    productId: number,
  ): Promise<{ count: number }> {
    await this.shoppingCartModel.update({ count }, { where: { productId } });

    const product = await this.shoppingCartModel.findOne({
      where: { productId },
    });

    return { count: product.count };
  }

  async updateTotalPrice(
    total_price: number,
    productId: number,
  ): Promise<{ total_price: number }> {
    await this.shoppingCartModel.update(
      { total_price },
      { where: { productId } },
    );

    const product = await this.shoppingCartModel.findOne({
      where: { productId },
    });

    return { total_price: product.price };
  }

  async remove(productId: number): Promise<void> {
    const product = await this.shoppingCartModel.findOne({
      where: { productId },
    });

    return product.destroy();
  }
  async removeAll(userId: number): Promise<void> {
    await this.shoppingCartModel.destroy({ where: { userId } });
  }
}
