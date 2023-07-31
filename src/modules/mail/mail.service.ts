import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}
  transporter = nodemailer.createTransport({
    host: this.configService.get('smtp_host'),
    port: this.configService.get('smtp_port'),
    secure: true,
    auth: {
      user: this.configService.get('smtp_user'),
      pass: this.configService.get('smtp_password'),
    },
  });
  async sendActivationLink(to: string, link: string) {
    await this.transporter.sendMail({
      from: this.configService.get('smtp_user'),
      to,
      subject: 'Активация аккаунта на ' + this.configService.get('base_url'),
      text: '',
      html: `
              <div>
                  <h1>Для активации аккаунта перейдите по ссылке</h1>
                  <a href="${link}">${link}</a>
              </div>
            `,
    });
  }

  async sendResetLink(to: string, link: string) {
    await this.transporter.sendMail({
      from: this.configService.get('smtp_user'),
      to,
      subject: 'Восстановление пароля ' + this.configService.get('base_url'),
      text: '',
      html: `
              <div>
                  <h1>Забыли пароль?</h1>
                  <p>Если нет, то проигнорируйте данное письмо</p>
                  <p>Если да, то перейдите по ссылке для восстановления пароля</p>
                  <p>Ссылка действительна 1 час</p>
                  <a href="${link}">Восстановить пароль</a>
              </div>
            `,
    });
  }
}
