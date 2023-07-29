import * as process from 'process';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  async sendActivationLink(to: string, link: string) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Активация аккаунта на ' + process.env.BASE_URL,
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
      from: process.env.SMTP_USER,
      to,
      subject: 'Восстановление пароля ' + process.env.BASE_URL,
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
