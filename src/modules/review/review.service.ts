import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from '@/modules/review/review.model';
import { ReviewsDtoCreate } from '@/modules/review/dto/review.dto';
import { Op } from 'sequelize';
import { ProductService } from '@/modules/product';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review)
    private reviewsModel: typeof Review,
    private productService: ProductService,
  ) {}

  async topProducts() {
    return await this.reviewsModel.findAll({
      where: { rating: { [Op.gt]: 4 } },
    });
  }

  async create(reviewsDtoCreate: ReviewsDtoCreate) {
    const review = new Review();
    const userReview = await this.reviewsModel.findOne({
      where: {
        product: reviewsDtoCreate.product,
        user: reviewsDtoCreate.user,
      },
    });

    if (userReview) {
      return {
        message: 'Вы уже оставляли отзыв о данном товаре',
        status: HttpStatus.CONFLICT,
      };
    }

    const productReviews = await this.reviewsModel.findAndCountAll({
      where: { product: reviewsDtoCreate.product },
    });

    const product = await this.productService.findOneByiD(
      reviewsDtoCreate.product,
    );

    if (productReviews.count > 0) {
      const { count, rows } = productReviews;

      product.rating = Number(
        (
          (rows.reduce((sum, item) => sum + item.rating, 0) +
            reviewsDtoCreate.rating) /
          (count + 1)
        ).toFixed(1),
      );

      review.product = reviewsDtoCreate.product;
      review.firstName = reviewsDtoCreate.firstName;
      review.lastName = reviewsDtoCreate.lastName;
      review.rating = reviewsDtoCreate.rating;
      review.review = reviewsDtoCreate.review;
      review.approved = false;
      await product.save();

      return review.save();
    }

    review.product = reviewsDtoCreate.product;
    review.firstName = reviewsDtoCreate.firstName;
    review.lastName = reviewsDtoCreate.lastName;
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
