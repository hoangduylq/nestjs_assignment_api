import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtContstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtContstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, UserService],
  exports: [AuthService],
})
export class AuthModule {}
