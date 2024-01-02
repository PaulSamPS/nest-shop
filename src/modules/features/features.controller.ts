import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { FeaturesService } from './features.service';
import {
  FeaturesArr,
  FeaturesDtoCreate,
} from '@/modules/features/dto/features.dto';
import { JSON } from 'sequelize';
import { Features } from '@/modules/features/features.model';

@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  async createFeatures(@Body() featuresCreateDto: FeaturesDtoCreate) {
    console.log(
      JSON().stringify(featuresCreateDto.features),
      featuresCreateDto.productName,
    );

    return this.featuresService.create(featuresCreateDto);
  }

  @Get('find/:name')
  getOne(@Param('name') name: string) {
    return this.featuresService.findOneByName(name);
  }
}
