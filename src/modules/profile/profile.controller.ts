import {
  Body,
  Controller,
  Delete,
  Get,
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
import { UserDto } from '@/modules/user/dto/user.dto';
import { Profile } from '@/modules/profile/model/profile.model';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly fileService: FilesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  @UseInterceptors(FilesInterceptor('avatar'))
  async update(
    @Body() profileDto: ProfileDto,
    @Req() request: { user: { user: UserDto } },
  ): Promise<Profile> {
    const user = request.user.user;

    return this.profileService.update(user.id, profileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-avatar')
  @UseInterceptors(FilesInterceptor('avatar'))
  async updateAvatar(
    @UploadedFiles() file: Express.Multer.File[],
    @Req() request: { user: { user: UserDto } },
  ) {
    const user = request.user.user;

    await this.fileService.removeFile(user.username);
    const imagesArr: MFile = await this.fileService.convertToWebpOne(file);
    const convertedImage: FileElementResponse =
      await this.fileService.saveFileOne(imagesArr, user.username, 'profile');

    return this.profileService.avatar(convertedImage, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get')
  async getProfile(@Req() request: { user: { user: UserDto } }) {
    const user = request.user.user;

    return await this.profileService.get(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('delete-avatar')
  @UseInterceptors(FilesInterceptor('avatar'))
  async deleteAvatar(
    @UploadedFiles() file: Express.Multer.File[],
    @Req() request: { user: { user: UserDto } },
  ) {
    const user = request.user.user;

    await this.fileService.removeFile(user.username);

    return this.profileService.deleteAvatar(user.id);
  }
}
