import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './product.model';
import { FilesService } from '@files';

@Module({
  imports: [SequelizeModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService, FilesService],
  exports: [ProductService],
})
export class ProductModule {}
