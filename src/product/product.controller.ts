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
import {
  ProductRequest,
  PaginateAndFilters,
  FindOneResponse,
  ProductResponse,
  BestSellersResponse,
  GetByNameRequest,
  GetByNameResponse,
  NewResponse,
  SearchRequest,
  SearchResponse,
} from './types';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly fileService: FilesService,
  ) {}

  @ApiBody({ type: ProductRequest })
  @ApiOkResponse({ type: ProductResponse })
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

  @ApiOkResponse({ type: PaginateAndFilters })
  @Get()
  paginateAndFilter(@Query() query) {
    return this.productService.paginateAndFilter(query);
  }

  @ApiOkResponse({ type: FindOneResponse })
  @Get('find/:id')
  getOne(@Param('id') id: string) {
    return this.productService.findOneByiD(id);
  }

  @ApiOkResponse({ type: BestSellersResponse })
  @Get('bestseller')
  getBestseller() {
    return this.productService.bestsellers();
  }

  @ApiOkResponse({ type: NewResponse })
  @Get('new')
  getNew() {
    return this.productService.new();
  }

  @ApiBody({ type: SearchRequest })
  @ApiOkResponse({ type: SearchResponse })
  @Post('search')
  search(@Body() { search }: { search: string }) {
    return this.productService.searchByString(search);
  }

  @ApiBody({ type: GetByNameRequest })
  @ApiOkResponse({ type: GetByNameResponse })
  @Post('name')
  getByName(@Body() { name }: { name: string }) {
    return this.productService.findOneByName(name);
  }
}
