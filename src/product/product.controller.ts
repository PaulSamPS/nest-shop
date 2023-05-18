import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from '@files';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { CreateProductRequest, CreateProductResponse } from './types';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly fileService: FilesService,
  ) {}

  @ApiBody({ type: CreateProductRequest })
  @ApiOkResponse({ type: CreateProductResponse })
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  @UseInterceptors(FilesInterceptor('image'))
  async createFurniture(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const imagesArr = await this.fileService.convertToWebp(files);
    const convertedImages = await this.fileService.saveFile(
      imagesArr,
      createProductDto,
    );
    return this.productService.create(createProductDto, convertedImages);
  }

  @Get()
  paginateAndFilter(@Query() query) {
    return this.productService.paginateAndFilter(query);
  }

  @Get('find/:id')
  getOne(@Param('id') id: string) {
    return this.productService.findOneByiD(id);
  }

  @Get('bestseller')
  getBestseller() {
    return this.productService.bestsellers();
  }

  @Get('new')
  getNew() {
    return this.productService.new();
  }

  @Post('search')
  search(@Body() { search }: { search: string }) {
    return this.productService.searchByString(search);
  }

  @Post('name')
  getByName(@Body() { name }: { name: string }) {
    return this.productService.findOneByName(name);
  }
}
