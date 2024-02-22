import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from './cart.model';
import { UserService } from '@/modules/user';
import { ProductService } from '@/modules/product';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { Product } from '@/modules/product/product.model';
import { ProductCartDto } from '@/modules/cart/dto/productCart.dto';
import { AppError } from '@/common/constants/appError';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart)
    private cartModel: typeof Cart,
    private readonly usersService: UserService,
    private readonly productsService: ProductService,
  ) {}

  async findAll(userId: number): Promise<Cart[]> {
    return this.cartModel.findAll({ where: { userId } });
  }

  async get(userId: number) {
    const exitingShoppingCart = await this.cartModel.findOne({
      where: { user: userId },
    });

    if (!exitingShoppingCart) {
      return null;
    }

    // exitingShoppingCart.total_price = 0;
    //
    // for (let i = 0; i < exitingShoppingCart.products.length; i++) {
    //   const product = await this.productsService.findOneByiD(
    //     exitingShoppingCart.products[i].productId,
    //   );
    //   exitingShoppingCart.products[i].price = product.price;
    //   exitingShoppingCart.total_price +=
    //     product.price * exitingShoppingCart.products[i].count;
    //   exitingShoppingCart.discount =
    //     product.oldPrice > 0
    //       ? (product.oldPrice - product.price) *
    //         exitingShoppingCart.products[i].count
    //       : 0;
    // }
    //
    // exitingShoppingCart.changed('products', true);

    return exitingShoppingCart;
  }

  async add(
    addToCartDto: AddToCartDto,
    userId: number,
  ): Promise<Cart | { message: string }> {
    const product: Product = await this.productsService.findOneByiD(
      addToCartDto.productId,
    );

    const exitingShoppingCart = await this.cartModel.findOne({
      where: { user: userId },
    });

    if (!product) {
      throw new HttpException(
        AppError.ITEM_DOES_NOT_EXIST,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!exitingShoppingCart) {
      const newCart: {
        user: number;
        products: ProductCartDto[];
        total_price: number;
        discount: number;
      } = {
        user: userId,
        products: [
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            in_stock: product.in_stock - 1,
            image: product.images[0].url,
            count: 1,
            discount: product.discount,
          },
        ],
        total_price: product.price,
        discount: product.oldPrice > 0 ? product.oldPrice - product.price : 0,
      };

      return await this.cartModel.create(newCart);
    }

    const productIncludes: boolean = exitingShoppingCart.products.some(
      (p: ProductCartDto) => p.productId === product.id,
    );

    if (productIncludes) {
      return exitingShoppingCart;
    }

    const newProduct: ProductCartDto = {
      productId: product.id,
      name: product.name,
      price: product.price,
      in_stock: product.in_stock - 1,
      image: product.images[0].url,
      count: 1,
      discount: product.discount,
    };

    exitingShoppingCart.products = [
      ...exitingShoppingCart.products,
      newProduct,
    ];
    exitingShoppingCart.total_price += product.price;
    exitingShoppingCart.discount +=
      product.oldPrice > 0 ? product.oldPrice - product.price : 0;

    await exitingShoppingCart.save();

    return exitingShoppingCart;
  }

  async increaseCountAndTotalPrice(addToCartDto: AddToCartDto, userId: number) {
    const product: Product = await this.productsService.findOneByiD(
      addToCartDto.productId,
    );

    const exitingShoppingCart = await this.cartModel.findOne({
      where: { user: userId },
    });

    const productIncludes: boolean = exitingShoppingCart.products.some(
      (p: ProductCartDto) => p.productId === product.id,
    );

    if (exitingShoppingCart && productIncludes) {
      const productInTheCart: ProductCartDto =
        exitingShoppingCart.products.find(
          (p: ProductCartDto) => p.productId === product.id,
        );

      if (productInTheCart.in_stock > 0) {
        productInTheCart.count += 1;

        productInTheCart.in_stock -= 1;

        exitingShoppingCart.total_price += product.price;
        exitingShoppingCart.discount +=
          product.oldPrice > 0 ? product.oldPrice - product.price : 0;

        exitingShoppingCart.changed('products', true);

        return await exitingShoppingCart.save();
      }

      return exitingShoppingCart;
    }
  }

  async decreaseCountAndTotalPrice(addToCartDto: AddToCartDto, userId: number) {
    const product: Product = await this.productsService.findOneByiD(
      addToCartDto.productId,
    );

    const exitingShoppingCart = await this.cartModel.findOne({
      where: { user: userId },
    });

    const productIncludes: boolean = exitingShoppingCart.products.some(
      (p: ProductCartDto) => p.productId === product.id,
    );

    if (exitingShoppingCart && productIncludes) {
      const productInTheCart: ProductCartDto =
        exitingShoppingCart.products.find(
          (p: ProductCartDto) => p.productId === product.id,
        );

      if (productInTheCart.in_stock < product.in_stock - 1) {
        productInTheCart.count -= 1;

        productInTheCart.in_stock += 1;

        exitingShoppingCart.total_price -= product.price;
        exitingShoppingCart.discount -=
          product.oldPrice > 0 ? product.oldPrice - product.price : 0;

        exitingShoppingCart.changed('products', true);

        return await exitingShoppingCart.save();
      }

      return exitingShoppingCart;
    }
  }

  async remove(productId: number, userId: number) {
    const product: Product = await this.productsService.findOneByiD(productId);

    const exitingShoppingCart = await this.cartModel.findOne({
      where: { user: userId },
    });

    const productIncludes = exitingShoppingCart.products.find(
      (p: ProductCartDto) => p.productId === product.id,
    );

    if (exitingShoppingCart && productIncludes) {
      const productInTheCart: ProductCartDto =
        exitingShoppingCart.products.filter(
          (p: ProductCartDto) => p.productId !== product.id,
        );

      exitingShoppingCart.total_price -= product.price * productIncludes.count;
      exitingShoppingCart.discount -=
        product.oldPrice > 0
          ? (product.oldPrice - product.price) * productIncludes.count
          : 0;
      exitingShoppingCart.products = productInTheCart;

      return await exitingShoppingCart.save();
    }
  }

  async removeAll(userId: number): Promise<Cart> {
    const exitingShoppingCart = await this.cartModel.findOne({
      where: { user: userId },
    });

    exitingShoppingCart.products = [];
    exitingShoppingCart.total_price = 0;
    exitingShoppingCart.discount = 0;

    return await exitingShoppingCart.save();
  }
}
