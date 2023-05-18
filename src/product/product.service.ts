import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { FileElementResponse } from '../files/dto/file-element-response.response';
import { Op } from 'sequelize';
import { IProductsQuery } from './types';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async paginateAndFilter(
    query: IProductsQuery,
  ): Promise<{ count: number; rows: Product[] }> {
    const limit = +query.limit;
    const offset = +query.offset;
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
  ) {
    const product = new Product();
    const existingByUserName = await this.findOneByName(createProductDto.name);

    if (existingByUserName) {
      return {
        message: 'Товар с таким именем уже существует',
        status: HttpStatus.CONFLICT,
      };
    }

    product.price = createProductDto.price;
    product.name = createProductDto.name;
    product.description = createProductDto.description;
    product.images = JSON.stringify(files);
    product.dimensions = createProductDto.dimensions;
    product.in_stock = createProductDto.in_stock;
    product.bestseller = createProductDto.bestsellers;
    product.new = createProductDto.new;
    product.rating = createProductDto.rating;
    product.weight = createProductDto.weight;
    product.frame_material = createProductDto.frame_material;
    product.legs_material = createProductDto.legs_material;
    product.backrest_height = createProductDto.backrest_height;
    product.seat_height = createProductDto.seat_height;
    product.seat_depth = createProductDto.seat_depth;
    product.seat_width = createProductDto.seat_width;
    product.warranty_period = createProductDto.warranty_period;
    product.country_of_manufacture = createProductDto.country_of_manufacture;

    return product.save();
  }
}
