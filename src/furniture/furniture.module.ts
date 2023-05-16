import { Module } from '@nestjs/common';
import { FurnitureController } from './furniture.controller';
import { FurnitureService } from './furniture.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Furniture } from './furniture.model';
import { FilesService } from '../files/files.service';

@Module({
  imports: [SequelizeModule.forFeature([Furniture])],
  controllers: [FurnitureController],
  providers: [FurnitureService, FilesService],
  exports: [FurnitureService],
})
export class FurnitureModule {}
