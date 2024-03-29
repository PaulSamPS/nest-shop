import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from '@/modules/files';
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
import { Product } from './product.model';
import { MFile } from '@/modules/files/mfile.class';
import { FileElementResponse } from '@/modules/files/dto/file-element-response.response';

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
  ): Promise<Product | { message: string; status: HttpStatus }> {
    const imagesArr: MFile[] = await this.fileService.convertToWebp(files);
    const convertedImages: FileElementResponse[] =
      await this.fileService.saveFile(
        imagesArr,
        createProductDto.name,
        'products',
      );
    return this.productService.create(createProductDto, convertedImages);
  }

  @Patch('/update/:name')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  @UseInterceptors(FilesInterceptor('image'))
  async updateProduct(
    @Param('name') name: string,
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    let convertedImages: FileElementResponse[];
    if (files.length > 0) {
      const imagesArr: MFile[] = await this.fileService.convertToWebp(files);
      convertedImages = await this.fileService.saveFile(
        imagesArr,
        createProductDto.name,
        'products',
      );
    }
    return this.productService.update(createProductDto, name, convertedImages);
  }

  @ApiOkResponse({ type: PaginateAndFilters })
  @Get()
  getAll(@Query() query): Promise<{ count: number; rows: Product[] }> {
    return this.productService.paginateAndFilter(query);
  }

  @ApiOkResponse({ type: FindOneResponse })
  @Get('find/:name')
  getOne(@Param('name') name: string): Promise<Product> {
    return this.productService.findOneByName(name);
  }

  @ApiOkResponse({ type: BestSellersResponse })
  @Get('bestseller')
  getBestseller(): Promise<{ count: number; rows: Product[] }> {
    return this.productService.bestsellers();
  }

  @ApiOkResponse({ type: NewResponse })
  @Get('new')
  getNew(): Promise<{ count: number; rows: Product[] }> {
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

  @Get('new/get-main')
  getNewProducts() {
    return this.productService.getNewProducts();
  }

  @Get('top-products/get')
  async topProducts() {
    return await this.productService.getTopProducts();
  }

  @Get('/category/:category')
  getProductsByCategory(@Param('category') category: string) {
    return this.productService.getProductsByCategory(category);
  }
}
