import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from '@/modules/review/review.model';
import { ReviewsDtoCreate } from '@/modules/review/dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review)
    private reviewsModel: typeof Review,
  ) {}

  async create(reviewsDtoCreate: ReviewsDtoCreate) {
    const review = new Review();
    const userReview = await this.reviewsModel.findOne({
      where: {
        productName: reviewsDtoCreate.productName,
        userId: reviewsDtoCreate.userId,
      },
    });

    if (userReview) {
      return {
        message: 'Вы уже оставляли отзыв о данном товаре',
        status: HttpStatus.CONFLICT,
      };
    }

    review.productName = reviewsDtoCreate.productName;
    review.firstName = reviewsDtoCreate.firstName;
    review.lastName = reviewsDtoCreate.lastName;
    review.userId = reviewsDtoCreate.userId;
    review.rating = reviewsDtoCreate.rating;
    review.review = reviewsDtoCreate.review;
    review.approved = false;

    return review.save();
  }

  async findAll(name: string) {
    const reviews = await this.reviewsModel.findAndCountAll({
      where: { productName: name },
    });

    if (!reviews) {
      return {
        message: 'Пока еще никто не оставил отзыв',
        status: HttpStatus.CONFLICT,
      };
    }
    const { count, rows } = reviews;

    const rating = (
      rows.reduce((sum, item) => sum + item.rating, 0) / count
    ).toFixed(1);

    const sort = rows.sort(function (a, b) {
      return b.rating - a.rating;
    });

    return { sort, count, rating };
  }
}
