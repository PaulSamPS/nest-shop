import { Module } from '@nestjs/common';
import { FavouritesController } from './favourites.controller';
import { FavouritesService } from './favourites.service';
import { JwtService } from '@nestjs/jwt';
import { ProductModule } from '@/modules/product';
import { SequelizeModule } from '@nestjs/sequelize';
import { Favourites } from '@/modules/favourites/favourites.model';

@Module({
  imports: [SequelizeModule.forFeature([Favourites]), ProductModule],
  controllers: [FavouritesController],
  providers: [FavouritesService, JwtService],
})
export class FavouritesModule {}
