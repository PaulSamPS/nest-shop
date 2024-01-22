import { Module } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Features } from './features.model';
import { FeaturesController } from '@/modules/features/features.controller';
import { ProductModule } from '@/modules/product';

@Module({
  imports: [SequelizeModule.forFeature([Features]), ProductModule],
  providers: [FeaturesService],
  controllers: [FeaturesController],
  exports: [FeaturesService],
})
export class FeaturesModule {}
