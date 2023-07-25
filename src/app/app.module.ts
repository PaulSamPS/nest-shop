import { Module } from '@nestjs/common';
import { UserModule } from '@/user';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@/auth/auth.module';
import { ProductModule } from '@/product';
import { MulterModule } from '@nestjs/platform-express';
import { FilesModule } from '@/files';
import { ShoppingCartModule } from '@/shopping-cart';
import { PaymentModule } from '@/payment';
import configurations from '@/config';
import { MailModule } from '@/mail/mail.module';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('db_host'),
        port: configService.get('db_port'),
        username: configService.get('db_user'),
        password: configService.get('db_password'),
        database: configService.get('db_name'),
        synchronize: true,
        autoLoadModels: true,
        define: {
          charset: 'utf8',
          collate: 'utf8_general_ci',
        },
        models: [],
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),
    AuthModule,
    UserModule,
    MailModule,
    ProductModule,
    MulterModule.register({ dest: './uploads ' }),
    FilesModule,
    ShoppingCartModule,
    PaymentModule,
  ],
})
export class AppModule {}
