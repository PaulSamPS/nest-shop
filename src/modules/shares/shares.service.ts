import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Shares } from '@/modules/shares/shares.model';
import { FileElementResponse } from '@/modules/files/dto/file-element-response.response';
import { SharesDto } from '@/modules/shares/dto/shares.dto';

@Injectable()
export class SharesService {
  constructor(
    @InjectModel(Shares)
    private sharesModel: typeof Shares,
  ) {}

  async findOneByName(name: string): Promise<Shares> {
    return this.sharesModel.findOne({
      where: { name },
    });
  }
  async create(sharesDto: SharesDto, files: FileElementResponse) {
    const shares = new Shares();
    const existingBySharesName = await this.findOneByName(sharesDto.name);

    if (existingBySharesName) {
      return {
        message: 'Такая акция уже существует',
        status: HttpStatus.CONFLICT,
      };
    }

    shares.name = sharesDto.name;
    shares.path = sharesDto.path;
    shares.images = files;

    return await shares.save();
  }

  async getShares() {
    return await this.sharesModel.findAll();
  }
}
