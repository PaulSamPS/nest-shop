import { HttpStatus, Injectable } from '@nestjs/common';
import { FeaturesDtoCreate } from '@/modules/features/dto/features.dto';
import { Features } from '@/modules/features/features.model';
import { InjectModel } from '@nestjs/sequelize';
import { ProductService } from '@/modules/product';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectModel(Features)
    private featuresModel: typeof Features,
    private readonly productService: ProductService,
  ) {}
  async create(featuresDto: FeaturesDtoCreate) {
    const features = new Features();

    const existingByProductName = await this.featuresModel.findOne({
      where: { productName: featuresDto.productName },
    });

    if (existingByProductName) {
      return {
        message: 'Характеристики для данного продукта уже существуют',
        status: HttpStatus.CONFLICT,
      };
    }

    const product = await this.productService.findOneByName(
      featuresDto.productName,
    );

    if (!product) {
      return {
        message: 'Такого продукта рне существует',
        status: HttpStatus.CONFLICT,
      };
    }

    features.product = product.id;
    features.productName = featuresDto.productName;
    features.features = featuresDto.features;

    return features.save();
  }

  async findOneByName(name: string) {
    const features = await this.featuresModel.findOne({
      where: { productName: name },
    });

    if (!features) {
      return {
        message: 'Характеристики не найдены',
        status: HttpStatus.CONFLICT,
      };
    }
    return features;
  }
}
