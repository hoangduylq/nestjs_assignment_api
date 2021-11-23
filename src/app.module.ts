import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  GoogleRecaptchaModule,
  GoogleRecaptchaNetwork,
} from '@nestlab/google-recaptcha';
import { IncomingMessage } from 'http';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`environments/.env.${process.env.NODE_ENV}`],
      load: [configuration],
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.POSTGRE_HOST,
    //   port: parseInt(<string>process.env.POSTGRE_PORT),
    //   username: process.env.POSTGRES_USER,
    //   password: <string>process.env.POSTGRES_PASSWORD,
    //   entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    //   database: process.env.POSTGRES_DB,
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: +configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: configService.get('database.sync'),
        ssl: configService.get('database.ssl'),
        extra:
          configService.get('database.ssl') === true
            ? {
                ssl: {
                  rejectUnauthorized: false,
                },
              }
            : {},
      }),
    }),
    UserModule,
    AuthModule,
    // GoogleRecaptchaModule.forRoot({
    //   secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
    //   response: (req: IncomingMessage) =>
    //     (req.headers.recaptcha || '').toString(),
    //   // skipIf: process.env.NODE_ENV !== 'production',
    //   network: GoogleRecaptchaNetwork.Recaptcha,
    //   actions: ['SignUp', 'SignIn'],
    //   score: 0.8,
    // }),
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secretKey: configService.get('GOOGLE_RECAPTCHA_SECRET_KEY'),
        response: (req: IncomingMessage) =>
          (req.headers.recaptcha || '').toString(),
        // skipIf: process.env.NODE_ENV !== 'production',
        network: GoogleRecaptchaNetwork.Recaptcha,
        actions: ['SignUp', 'SignIn'],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
