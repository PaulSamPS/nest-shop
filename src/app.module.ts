import { Module } from '@nestjs/common';
import { UsersModule } from '@users';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { SequelizeConfigService, databaseConfig } from '@config';
import { AuthModule } from '@auth';
import { ProductModule } from '@product';
import { MulterModule } from '@nestjs/platform-express';
import { FilesModule } from '@files';
import { ShoppingCartModule } from '@shopping-cart';
import { PaymentModule } from '@payment';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useClass: SequelizeConfigService,
    }),
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
    UsersModule,
    AuthModule,
    ProductModule,
    MulterModule.register({ dest: './uploads ' }),
    FilesModule,
    ShoppingCartModule,
    PaymentModule,
  ],
})
export class AppModule {}
