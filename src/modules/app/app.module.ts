import { Module } from '@nestjs/common';
import { User, UserModule } from 'src/modules/user';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@/modules/auth/auth.module';
import { ProductModule } from 'src/modules/product';
import { MulterModule } from '@nestjs/platform-express';
import { FilesModule } from '@/modules/files';
import { CartModule } from 'src/modules/cart';
import { PaymentModule } from 'src/modules/payment';
import configurations from 'src/config';
import { MailModule } from '@/modules/mail/mail.module';
import { TokenModule } from '@/modules/token/token.module';
import { ProfileModule } from '@/modules/profile/profile.module';
import { Profile } from '@/modules/profile/model/profile.model';
import { Cart } from '@/modules/cart/cart.model';
import { FeaturesModule } from '@/modules/features/features.module';

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
        models: [User, Profile, Cart],
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
    CartModule,
    PaymentModule,
    TokenModule,
    ProfileModule,
    FeaturesModule,
  ],
})
export class AppModule {}
