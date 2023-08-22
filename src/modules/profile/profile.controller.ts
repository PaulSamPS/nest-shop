import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from '@/modules/profile/profile.service';
import { ProfileDto } from '@/modules/profile/dto/profile.dto';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import { FileElementResponse } from '@/modules/files/dto/file-element-response.response';
import { MFile } from '@/modules/files/mfile.class';
import { FilesService } from '@/modules/files';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly fileService: FilesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FilesInterceptor('avatar'))
  async create(
    @Body() profileDto: ProfileDto,
    @Req() request,
    @UploadedFiles() file: Express.Multer.File[],
  ) {
    const user = request.user;
    const imagesArr: MFile[] = await this.fileService.convertToWebp(file);
    const convertedImage: FileElementResponse[] =
      await this.fileService.saveFile(imagesArr, user, 'profile');
    return this.profileService.create(user, profileDto, convertedImage);
  }

  @Get('get')
  get() {
    return;
  }

  @Patch('update')
  update() {
    return;
  }

  @Delete()
  delete(@Query('id') id: string) {
    return;
  }
}
