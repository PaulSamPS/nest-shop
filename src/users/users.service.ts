import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { CodeDto } from './dto/code.dto';
import { Code } from './code.model';
import { IpAddress } from './ip-address.model';
import { Limits } from './limits';
import { addHours, addMinutes } from 'date-fns';
import { EnterCodeDto } from './dto/enter-code.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Code)
    private codeModel: typeof Code,
    @InjectModel(IpAddress)
    private ipAddressModel: typeof IpAddress,
  ) {}

  findOne(filter: {
    where: {
      id?: number;
      username?: string;
      email?: string;
      phone?: string;
    };
  }): Promise<User> {
    return this.userModel.findOne({ ...filter });
  }

  async create(createUserDto: CreateUserDto): Promise<string> {
    const user = new User();
    const existingByUserPhone = await this.findOne({
      where: { phone: createUserDto.phone },
    });

    if (existingByUserPhone) {
      return existingByUserPhone.phone;
    }
    user.phone = createUserDto.phone;
    await user.save();
    return user.phone;
  }

  async toSendCode(codeDto: CodeDto): Promise<{ msg: string }> {
    const userCode = new Code();
    const ipAddress = new IpAddress();
    const limit = new Limits();

    const existingByIpAddress = await this.ipAddressModel.findOne({
      where: { ip: codeDto.ip },
    });

    const existingByUserId = await this.codeModel.findOne({
      where: { phone: codeDto.phone },
    });

    const code = Math.floor(1000 + Math.random() * 9000);

    if (!existingByIpAddress) {
      ipAddress.ip = codeDto.ip;
      await ipAddress.save();
    }

    if (!existingByUserId && !existingByIpAddress) {
      userCode.phone = codeDto.phone;
      userCode.code = code;
      await userCode.save();
      ipAddress.ip = codeDto.ip;
      ipAddress.attempts = 4;
      await ipAddress.save();
      return { msg: 'Код отправлен' };
    }

    if (
      !existingByUserId &&
      existingByIpAddress &&
      existingByIpAddress.attempts === 0
    ) {
      return await limit.validateIp(existingByIpAddress.updatedAt);
    }

    if (
      !existingByUserId &&
      existingByIpAddress &&
      existingByIpAddress.attempts > 0
    ) {
      userCode.code = code;
      userCode.phone = codeDto.phone;
      await userCode.save();

      existingByIpAddress.attempts -= 1;
      await existingByIpAddress.save();

      return { msg: 'Код отправлен' };
    }

    const updateAtPlusTwoMinutes = addMinutes(existingByUserId.updatedAt, 2);

    if (
      updateAtPlusTwoMinutes > new Date() &&
      existingByIpAddress &&
      existingByIpAddress.attempts > 0
    ) {
      return await limit.validateTimeSendCode(updateAtPlusTwoMinutes);
    }

    const updateAtPlusThreeHours = addHours(existingByIpAddress.updatedAt, 3);

    if (existingByIpAddress && existingByIpAddress.attempts > 0) {
      existingByIpAddress.attempts -= 1;
      await existingByIpAddress.save();
    } else if (
      existingByIpAddress.attempts === 0 &&
      updateAtPlusThreeHours > new Date()
    ) {
      return await limit.validateIp(existingByIpAddress.updatedAt);
    } else {
      existingByIpAddress.attempts = 5;
      existingByIpAddress.attempts -= 1;
      await existingByIpAddress.save();
    }

    existingByUserId.code = code;
    await existingByUserId.save();

    return { msg: 'Код отправлен' };
  }

  async enterCode(enterCode: EnterCodeDto, ip: string) {
    const ipAddress = new IpAddress();

    const findUserCode = await this.codeModel.findOne({
      where: { phone: enterCode.phone },
    });

    const existingByIpAddress = await this.ipAddressModel.findOne({
      where: { ip },
    });

    if (!existingByIpAddress) {
      ipAddress.ip = ip;
      await ipAddress.save();
    }

    if (findUserCode && findUserCode.code === enterCode.code) {
      const user = await this.userModel.findOne({
        where: { phone: enterCode.phone },
      });
      await this.codeModel.destroy({ where: { phone: enterCode.phone } });
      existingByIpAddress.attempts = 5;
      await existingByIpAddress.save();
      return { user, msg: 'Вход выполнен' };
    } else {
      return { msg: 'Невереый код' };
    }
  }
}
