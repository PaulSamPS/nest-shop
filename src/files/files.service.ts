import { Injectable } from '@nestjs/common';
import { FileElementResponse } from './dto/file-element-response.response';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { CreateProductDto } from '../product/dto/create-product.dto';
import * as sharp from 'sharp';
import { MFile } from './mfile.class';

@Injectable()
export class FilesService {
  async saveFile(
    files: MFile[],
    createFurnitureDtp: CreateProductDto,
  ): Promise<FileElementResponse[]> {
    const uploadFolder = `${path}/uploads/${createFurnitureDtp.name}`;
    await ensureDir(uploadFolder);
    const res: FileElementResponse[] = [];

    for (const file of files) {
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
      res.push({
        url: `/static/${createFurnitureDtp.name}/${file.originalname}`,
        name: file.originalname,
      });
    }

    return res;
  }

  async convertToWebp(files: Express.Multer.File[]): Promise<MFile[]> {
    const imagesArr: MFile[] = [];
    for (const file of files) {
      if (file.mimetype.includes('image')) {
        imagesArr.push(
          new MFile({
            originalname: `${file.originalname.split('.')[0]}.webp`,
            buffer: await sharp(file.buffer).webp().toBuffer(),
          }),
        );
      }
    }
    return imagesArr;
  }
}
