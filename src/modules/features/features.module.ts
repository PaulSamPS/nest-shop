import { Module } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Features } from './features.model';
import { FeaturesController } from '@/modules/features/features.controller';

@Module({
  imports: [SequelizeModule.forFeature([Features])],
  providers: [FeaturesService],
  controllers: [FeaturesController],
  exports: [FeaturesService],
})
export class FeaturesModule {}
