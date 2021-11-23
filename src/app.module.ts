import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  GoogleRecaptchaModule,
  GoogleRecaptchaNetwork,
} from '@nestlab/google-recaptcha';
import { IncomingMessage } from 'http';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GoogleRecaptchaModule.forRoot({
      secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
      response: (req) => req.headers.recaptcha,
      skipIf: process.env.NODE_ENV !== 'production',
      network: GoogleRecaptchaNetwork.Recaptcha,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRE_HOST,
      port: parseInt(<string>process.env.POSTGRE_PORT),
      username: process.env.POSTGRES_USER,
      password: <string>process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,
      // extra: { ssl: { rejectUnauthorized: true } },
    }),
    AuthModule,
    GoogleRecaptchaModule.forRoot({
      secretKey: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
      response: (req: IncomingMessage) =>
        (req.headers.recaptcha || '').toString(),
      // skipIf: process.env.NODE_ENV !== 'production',
      network: GoogleRecaptchaNetwork.Recaptcha,
      actions: ['SignUp', 'SignIn'],
      score: 0.8,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
