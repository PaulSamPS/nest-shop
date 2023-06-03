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
      email?: string;
      phone?: string;
    };
  }): Promise<User> {
    return this.userModel.findOne({ ...filter });
  }

  async create(createUserDto: CreateUserDto): Promise<string> {
    const user: User = new User();
    const existingByUserPhone: User = await this.findOne({
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
    const userCode: Code = new Code();
    const ipAddress: IpAddress = new IpAddress();
    const limit: Limits = new Limits();

    const existingByIp: IpAddress = await this.ipAddressModel.findOne({
      where: { ip: codeDto.ip },
    });

    const existingByPhoneCode: Code = await this.codeModel.findOne({
      where: { phone: codeDto.phone },
    });

    // Генерация кода

    const code: number = Math.floor(1000 + Math.random() * 9000);

    // Нет ip в базе

    if (!existingByIp) {
      ipAddress.ip = codeDto.ip;
      await ipAddress.save();
    }

    // Нет кода и нет ip в базе

    if (!existingByPhoneCode && !existingByIp) {
      userCode.phone = codeDto.phone;
      userCode.code = code;
      await userCode.save();
      ipAddress.ip = codeDto.ip;
      ipAddress.attempts = 4;
      await ipAddress.save();
      return { msg: 'Код отправлен' };
    }

    // Нет кода и нет попыток отправки кода для ip

    if (!existingByPhoneCode && existingByIp && existingByIp.attempts === 0) {
      return await limit.validateIp(existingByIp.updatedAt);
    }

    // Нет кода и есть попытки отправки кода для ip

    if (!existingByPhoneCode && existingByIp && existingByIp.attempts > 0) {
      userCode.code = code;
      userCode.phone = codeDto.phone;
      await userCode.save();

      existingByIp.attempts -= 1;
      await existingByIp.save();

      return { msg: 'Код отправлен' };
    }

    // Проверка времени последней отправки кода

    const updateAtPlusTwoMinutes: Date = addMinutes(
      existingByPhoneCode.updatedAt,
      2,
    );

    if (
      updateAtPlusTwoMinutes > new Date() &&
      existingByIp &&
      existingByIp.attempts > 0
    ) {
      return await limit.validateTimeSendCode(updateAtPlusTwoMinutes);
    }

    // Проверка оставшихся попыток входа по ip

    const updateAtPlusThreeHours: Date = addHours(existingByIp.updatedAt, 3);

    if (existingByIp && existingByIp.attempts > 0) {
      existingByIp.attempts -= 1;
      await existingByIp.save();
    } else if (
      existingByIp.attempts === 0 &&
      updateAtPlusThreeHours > new Date()
    ) {
      return await limit.validateIp(existingByIp.updatedAt);
    } else {
      existingByIp.attempts = 5;
      existingByIp.attempts -= 1;
      await existingByIp.save();
    }

    // Если все хорошо то просто записывается новый код в базе

    existingByPhoneCode.code = code;
    await existingByPhoneCode.save();

    return { msg: 'Код отправлен' };
  }

  async enterCode(
    enterCode: EnterCodeDto,
    ip: string,
  ): Promise<{ user: User; msg: string } | { msg: string; user?: undefined }> {
    const ipAddress: IpAddress = new IpAddress();

    const findUserCode: Code = await this.codeModel.findOne({
      where: { phone: enterCode.phone },
    });

    const updateAtPlusFiveMinutes: Date = addMinutes(findUserCode.updatedAt, 5);

    const existingByIpAddress: IpAddress = await this.ipAddressModel.findOne({
      where: { ip },
    });

    if (!findUserCode) {
      return { msg: 'Получите новый код' };
    }

    // Если нет ip в базе то записывается новый

    if (!existingByIpAddress) {
      ipAddress.ip = ip;
      await ipAddress.save();
    }

    // Если код найден , совпадает и срок действия не истек то возвращает пользователя

    if (
      findUserCode &&
      findUserCode.code === enterCode.code &&
      updateAtPlusFiveMinutes > new Date()
    ) {
      const user: User = await this.userModel.findOne({
        where: { phone: enterCode.phone },
      });
      await this.codeModel.destroy({ where: { phone: enterCode.phone } });
      existingByIpAddress.attempts = 5;
      await existingByIpAddress.save();
      return { user, msg: 'Вход выполнен' };
    } else if (
      findUserCode &&
      findUserCode.code === enterCode.code &&
      updateAtPlusFiveMinutes < new Date()
    ) {
      await this.codeModel.destroy({ where: { phone: enterCode.phone } });
      existingByIpAddress.attempts -= 1;
      await existingByIpAddress.save();
      return { msg: 'Код просрочен, повторите отправку кода' };
    } else {
      return { msg: 'Невереый код' };
    }
  }
}
