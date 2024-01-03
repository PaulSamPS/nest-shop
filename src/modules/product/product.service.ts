import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { Op } from 'sequelize';
import { IProductsQuery } from './types';
import { FileElementResponse } from '@/modules/files/dto/file-element-response.response';

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
    return this.productModel.findOne({ where: { name } });
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

    return product.save();
  }
}
