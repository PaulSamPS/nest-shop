import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MFile } from '@/modules/files/mfile.class';
import { FileElementResponse } from '@/modules/files/dto/file-element-response.response';
import { FilesService } from '@/modules/files';
import { SharesService } from '@/modules/shares/shares.service';
import { Shares } from '@/modules/shares/shares.model';
import { SharesDto } from '@/modules/shares/dto/shares.dto';
import { JwtAuthGuard } from '@/guards/jwt.guard';

@Controller('shares')
export class SharesController {
  constructor(
    private readonly sharesService: SharesService,
    private readonly fileService: FilesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  @UseInterceptors(FilesInterceptor('image'))
  async createShares(
    @Body() sharesDto: SharesDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Shares | { message: string; status: HttpStatus }> {
    console.log(files);
    const imagesArr: MFile = await this.fileService.convertToWebpOne(files);
    const convertedImages: FileElementResponse =
      await this.fileService.saveFileOne(imagesArr, sharesDto.name, 'shares');
    return this.sharesService.create(sharesDto, convertedImages);
  }

  @Get('/get')
  getShares(): Promise<Shares[]> {
    return this.sharesService.getShares();
  }
}
