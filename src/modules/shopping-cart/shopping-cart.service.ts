import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ShoppingCart } from './shopping-cart.model';
import { User, UserService } from '@/modules/user';
import { ProductService } from '@/modules/product';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Product } from '@/modules/product/product.model';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectModel(ShoppingCart)
    private shoppingCartModel: typeof ShoppingCart,
    private readonly usersService: UserService,
    private readonly productsService: ProductService,
  ) {}

  async findAll(userId: number): Promise<ShoppingCart[]> {
    return this.shoppingCartModel.findAll({ where: { userId } });
  }

  async get(userId: number) {
    const shoppingCart = new ShoppingCart();
    const exitingShoppingCart = await this.shoppingCartModel.findOne({
      where: { user: userId },
    });

    if (!exitingShoppingCart) {
      return shoppingCart.save();
    }

    return exitingShoppingCart;
  }

  async add(addToCartDto: AddToCartDto, userId: number): Promise<ShoppingCart> {
    const cart: ShoppingCart = new ShoppingCart();

    const product: Product = await this.productsService.findOneByiD(
      addToCartDto.productId,
    );

    const exitingShoppingCart = await this.shoppingCartModel.findAll({
      where: { user: userId },
    });

    if (!exitingShoppingCart) {
      const newCart = {
        user: userId,
        productId: product.id,
        name: product.name,
        price: product.price,
        weight: product.weight,
        in_stock: product.in_stock,
        image: JSON.parse(product.images)[0].url,
        total_price: product.price,
      };

      return await this.shoppingCartModel.create(newCart);
    }

    cart.productId = product.id;
    cart.name = product.name;
    cart.price = product.price;
    cart.weight = product.weight;
    cart.in_stock = product.in_stock;
    cart.image = JSON.parse(product.images)[0].url;
    cart.total_price = product.price;

    return cart.save();
  }

  async increaseCountAndTotalPrice(
    productId: number,
  ): Promise<{ count: number; total_price: number }> {
    const product: ShoppingCart = await this.shoppingCartModel.findOne({
      where: { productId },
    });

    product.count += 1;
    product.total_price = product.count * product.price;
    await product.save();

    return { count: product.count, total_price: product.total_price };
  }

  async decreaseCountAndTotalPrice(
    productId: number,
  ): Promise<{ count: number; total_price: number } | { msg: string }> {
    const product: ShoppingCart = await this.shoppingCartModel.findOne({
      where: { productId },
    });

    if (product.count > 1) {
      product.count -= 1;
      product.total_price = product.count * product.price;
      await product.save();

      return { count: product.count, total_price: product.total_price };
    }

    return { msg: 'Минимальное колличество 1' };
  }

  async remove(productId: number): Promise<void> {
    const product: ShoppingCart = await this.shoppingCartModel.findOne({
      where: { productId },
    });

    return product.destroy();
  }
  async removeAll(userId: number): Promise<void> {
    await this.shoppingCartModel.destroy({ where: { userId } });
  }
}
