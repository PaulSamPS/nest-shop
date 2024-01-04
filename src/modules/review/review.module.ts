import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Review } from '@/modules/review/review.model';
import { ReviewController } from '@/modules/review/review.controller';
import { ProductModule } from '@/modules/product';

@Module({
  imports: [SequelizeModule.forFeature([Review]), ProductModule],
  providers: [ReviewService],
  controllers: [ReviewController],
  exports: [ReviewService],
})
export class ReviewModule {}
