import { Module } from '@nestjs/common';
import { FurnitureController } from './furniture.controller';
import { FurnitureService } from './furniture.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Furniture } from './furniture.model';

@Module({
  imports: [SequelizeModule.forFeature([Furniture])],
  controllers: [FurnitureController],
  providers: [FurnitureService],
  exports: [FurnitureService],
})
export class FurnitureModule {}
