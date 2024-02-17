import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import { UserDto } from '@/modules/user/dto/user.dto';
import { FavouritesService } from '@/modules/favourites/favourites.service';
import { FavouritesDto } from '@/modules/favourites/dto/favourites.dto';

@Controller('favourites')
export class FavouritesController {
  constructor(private favouritesService: FavouritesService) {}
  @UseGuards(JwtAuthGuard)
  @Get('/get')
  getUserFavourites(@Req() request: { user: { user: UserDto } }) {
    const userId = request.user.user.id;

    return this.favouritesService.get(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/add')
  addUserFavourites(
    @Body() favouritesDto: FavouritesDto,
    @Req() request: { user: { user: UserDto } },
  ) {
    const userId = request.user.user.id;

    return this.favouritesService.addFavourites(favouritesDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/remove')
  removeUserFavourites(
    @Body() favouritesDto: FavouritesDto,
    @Req() request: { user: { user: UserDto } },
  ) {
    const userId = request.user.user.id;

    return this.favouritesService.removeFavourites(favouritesDto, userId);
  }
}
