import { Injectable } from '@nestjs/common';
import { addHours, differenceInMilliseconds } from 'date-fns';

@Injectable()
export class Limits {
  async validateTimeSendCode(updatedAt: Date) {
    const millis = differenceInMilliseconds(updatedAt, Date.now());
    const minutes = Math.floor((millis / (1000 * 60)) % 60);
    const seconds = Math.floor((millis / 1000) % 60);
    return {
      msg: `Повторная отправка возможна через: ${
        minutes + ':' + (seconds < 10 ? '0' : '') + seconds
      }`,
    };
  }

  async validateIp(updatedAt: Date) {
    const millis = differenceInMilliseconds(addHours(updatedAt, 3), Date.now());
    const hours = Math.floor((millis / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((millis / (1000 * 60)) % 60);
    const seconds = Math.floor((millis / 1000) % 60);
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
