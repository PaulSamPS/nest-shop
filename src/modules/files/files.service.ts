import { Injectable } from '@nestjs/common';
import { FileElementResponse } from './dto/file-element-response.response';
import { path } from 'app-root-path';
import { emptyDir, ensureDir, writeFile } from 'fs-extra';
import { MFile } from './mfile.class';
import * as sharp from 'sharp';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  async saveFile(
    files: MFile[],
    name: string,
    folder: string,
  ): Promise<FileElementResponse[]> {
    const uploadFolder = `${path}/uploads/${folder}/${name}`;
    await ensureDir(uploadFolder);
    const res: FileElementResponse[] = [];

    for (const file of files) {
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
      res.push({
        url: `/static/${folder}/${name}/${file.originalname}`,
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
            originalname: `${uuid.v4().split('.')[0]}.webp`,
            buffer: await sharp(file.buffer).webp().toBuffer(),
          }),
        );
      }
    }
    return imagesArr;
  }

  async removeFile(username: string) {
    await emptyDir(`${path}/uploads/profile/${username}`),
      (err) => {
        if (err) console.error(err);
        console.log('Файл Удалён');
      };
  }
}
