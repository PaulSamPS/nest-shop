import { Injectable } from '@nestjs/common';
import { addHours, differenceInMilliseconds } from 'date-fns';

@Injectable()
export class Limits {
  async validateTimeSendCode(updatedAt: Date): Promise<{ msg: string }> {
    const millis: number = differenceInMilliseconds(updatedAt, Date.now());
    const minutes: number = Math.floor((millis / (1000 * 60)) % 60);
    const seconds: number = Math.floor((millis / 1000) % 60);
    return {
      msg: `Повторная отправка возможна через: ${
        minutes + ':' + (seconds < 10 ? '0' : '') + seconds
      }`,
    };
  }

  async validateIp(updatedAt: Date): Promise<{ msg: string }> {
    const millis: number = differenceInMilliseconds(
      addHours(updatedAt, 3),
      Date.now(),
    );
    const hours: number = Math.floor((millis / (1000 * 60 * 60)) % 24);
    const minutes: number = Math.floor((millis / (1000 * 60)) % 60);
    const seconds: number = Math.floor((millis / 1000) % 60);
    return {
      msg: `Вы исчерпали лимит отправки код.Вы сможете отправить код через: ${
        (hours < 10 ? '0' : '') +
        hours +
        ':' +
        minutes +
        ':' +
        (seconds < 10 ? '0' : '') +
        seconds
      }`,
    };
  }
}
