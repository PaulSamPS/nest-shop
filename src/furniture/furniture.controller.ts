import {
  Body,
  Controller,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FurnitureService } from './furniture.service';
import { CreateFurnitureDto } from './dto/create-furniture.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  editFileName,
  imageFileFilter,
  destination,
} from '../config/file-upload';

@Controller('furniture')
export class FurnitureController {
  constructor(private readonly furnitureService: FurnitureService) {}

  @Post('/create-product')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  createFurniture(
    @Body() createFurnitureDto: CreateFurnitureDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.furnitureService.create(createFurnitureDto, image);
  }
}
