import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from '@/modules/review/review.service';
import { ReviewsDtoCreate } from './dto/review.dto';
import { JwtAuthGuard } from '@/guards/jwt.guard';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  async createFeatures(@Body() reviewsDtoCreate: ReviewsDtoCreate) {
    return this.reviewService.create(reviewsDtoCreate);
  }

  @Get(':name')
  getAll(@Param('name') name: string) {
    console.log(name);
    return this.reviewService.findAll(name);
  }
}
