import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Furniture } from './furniture.model';
import { CreateFurnitureDto } from './dto/create-furniture.dto';
import { FileElementResponse } from '../files/dto/file-element-response.response';

@Injectable()
export class FurnitureService {
  constructor(
    @InjectModel(Furniture)
    private furnitureModel: typeof Furniture,
  ) {}

  findOne(filter: { where: { name?: string } }): Promise<Furniture> {
    return this.furnitureModel.findOne({ ...filter });
  }

  async create(
    createFurnitureDtp: CreateFurnitureDto,
    files: FileElementResponse[],
  ) {
    const furniture = new Furniture();
    const existingByUserName = await this.findOne({
      where: { name: createFurnitureDtp.name },
    });

    if (existingByUserName) {
      return {
        message: 'Товар с таким именем уже существует',
        status: HttpStatus.CONFLICT,
      };
    }

    furniture.name = createFurnitureDtp.name;
    furniture.description = createFurnitureDtp.description;
    furniture.in_stock = createFurnitureDtp.in_stock;
    furniture.price = createFurnitureDtp.price;
    furniture.dimensions = createFurnitureDtp.dimensions;
    furniture.bestsellers = createFurnitureDtp.bestsellers;
    furniture.new = createFurnitureDtp.new;
    furniture.weight = createFurnitureDtp.weight;
    furniture.warranty_period = createFurnitureDtp.warranty_period;
    furniture.country_of_manufacture =
      createFurnitureDtp.country_of_manufacture;
    furniture.images = JSON.stringify(files);

    return furniture.save();
  }
}
