import {
  Body,
  Controller,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FurnitureService } from './furniture.service';
import { CreateFurnitureDto } from './dto/create-furniture.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from '../files/files.service';

@Controller('furniture')
export class FurnitureController {
  constructor(
    private readonly furnitureService: FurnitureService,
    private readonly fileService: FilesService,
  ) {}

  @Post('/create-product')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  @UseInterceptors(FilesInterceptor('image'))
  async createFurniture(
    @Body() createFurnitureDto: CreateFurnitureDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const imagesArr = await this.fileService.convertToWebp(files);
    const convertedImages = await this.fileService.saveFile(
      imagesArr,
      createFurnitureDto,
    );
    return this.furnitureService.create(createFurnitureDto, convertedImages);
  }
}
