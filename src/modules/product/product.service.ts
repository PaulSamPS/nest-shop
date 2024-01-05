import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { Op } from 'sequelize';
import { IProductsQuery } from './types';
import { FileElementResponse } from '@/modules/files/dto/file-element-response.response';
import { Review } from '@/modules/review/review.model';
import { Features } from '@/modules/features/features.model';

let dayProducts: Product[] = [];
let productsYesterday: Product[] = [];
@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async paginateAndFilter(
    query: IProductsQuery,
  ): Promise<{ count: number; rows: Product[] }> {
    const limit: number = +query.limit;
    const offset: number = +query.offset;
    return this.productModel.findAndCountAll({
      limit,
      offset,
    });
  }

  async bestsellers(): Promise<{ count: number; rows: Product[] }> {
    return this.productModel.findAndCountAll({
      where: { bestseller: true },
    });
  }

  async new(): Promise<{ count: number; rows: Product[] }> {
    return this.productModel.findAndCountAll({
      where: { new: true },
    });
  }

  async findOneByName(name: string): Promise<Product> {
    return this.productModel.findOne({
      where: { name },
      include: [
        {
          model: Review,
          required: false,
        },
        { model: Features, required: false },
      ],
    });
  }

  async findOneByiD(id: number | string): Promise<Product> {
    return this.productModel.findOne({ where: { id } });
  }

  async searchByString(
    str: string,
  ): Promise<{ count: number; rows: Product[] }> {
    return this.productModel.findAndCountAll({
      limit: 20,
      where: { name: { [Op.like]: `%${str}%` } },
    });
  }

  async create(
    createProductDto: CreateProductDto,
    files: FileElementResponse[],
  ): Promise<Product | { message: string; status: HttpStatus }> {
    const product: Product = new Product();
    const existingByUserName: Product = await this.findOneByName(
      createProductDto.name,
    );

    if (existingByUserName) {
      return {
        message: 'Товар с таким именем уже существует',
        status: HttpStatus.CONFLICT,
      };
    }

    product.price = createProductDto.price;
    product.oldPrice = createProductDto.oldPrice;
    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.images = files;
    product.in_stock = createProductDto.in_stock;
    product.bestseller = createProductDto.bestsellers;
    product.new = createProductDto.new;
    product.category = createProductDto.category;
    product.rating = 0;

    if (createProductDto.oldPrice > 0) {
      product.discount = Math.floor(
        ((createProductDto.oldPrice - createProductDto.price) /
          createProductDto.oldPrice) *
          100,
      );
    }

    return product.save();
  }

  async update(
    createProductDto: CreateProductDto,
    productName: string,
    files?: FileElementResponse[],
  ) {
    const existingByUserName: Product = await this.findOneByName(productName);
    console.log(files);

    if (!existingByUserName) {
      return {
        message: 'Товара нет',
        status: HttpStatus.CONFLICT,
      };
    }

    if (createProductDto.price) {
      existingByUserName.price = createProductDto.price;
      existingByUserName.discount = Math.floor(
        ((existingByUserName.oldPrice - createProductDto.price) /
          existingByUserName.oldPrice) *
          100,
      );
    }

    if (createProductDto.oldPrice) {
      existingByUserName.oldPrice = createProductDto.oldPrice;
      existingByUserName.discount = Math.floor(
        ((createProductDto.oldPrice - existingByUserName.price) /
          createProductDto.oldPrice) *
          100,
      );
    }

    if (createProductDto.description) {
      existingByUserName.description = createProductDto.description;
    }

    if (files) {
      existingByUserName.images = files;
    }

    if (createProductDto.in_stock) {
      existingByUserName.in_stock = createProductDto.in_stock;
    }

    return existingByUserName.save();
  }

  async setDayProducts() {
    const product = await this.productModel.findAll({
      include: [
        { model: Review, required: false },
        { model: Features, required: false },
      ],
    });

    if (product) {
      productsYesterday = dayProducts;
      dayProducts = [];
      const p = product.map((i) => i);
      for (let i = 0; i < 5; i++) {
        const ind = Math.floor(Math.random() * p.length);
        const item = p[ind];

        if (item && item.oldPrice > 0) {
          dayProducts.push(p.splice(ind, 1)[0]);
        }
      }
      return dayProducts;
    }

    return {
      message: 'Продукты не найдены',
      status: HttpStatus.CONFLICT,
    };
  }

  async getDayProducts() {
    return dayProducts;
  }

  async getNewProducts() {
    return await this.productModel.findAll({
      where: { new: true },
      include: [
        {
          model: Review,
          required: false,
        },
        { model: Features, required: false },
      ],
    });
  }

  async getTopProducts() {
    const products = await this.productModel.findAll({
      where: { rating: { [Op.gt]: 4 }, new: false },
      include: [
        {
          model: Review,
          required: false,
        },
        {
          model: Features,
          required: false,
        },
      ],
    });

    if (products.length <= 0) {
      return {
        message: 'Продукты не найдены',
        status: HttpStatus.CONFLICT,
      };
    }

    return products;
  }
}
