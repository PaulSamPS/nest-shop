import { HttpStatus, Injectable } from '@nestjs/common';
import { FeaturesDtoCreate } from '@/modules/features/dto/features.dto';
import { Features } from '@/modules/features/features.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectModel(Features)
    private featuresModel: typeof Features,
  ) {}
  async create(featuresDto: FeaturesDtoCreate) {
    const features = new Features();

    const existingByProductId = await this.featuresModel.findOne({
      where: { productName: featuresDto.productName },
    });

    if (existingByProductId) {
      return {
        message: 'Характеристики для данного продукта уже существуют',
        status: HttpStatus.CONFLICT,
      };
    }

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
