import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  GoogleRecaptchaGuard,
  RecaptchaResult,
  SetRecaptchaOptions,
} from '@nestlab/google-recaptcha';
import { GoogleRecaptchaValidationResult } from '@nestlab/google-recaptcha/interfaces/google-recaptcha-validation-result';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login(@Request() req, @Body() model: UserLoginDto) {
    return this.authService.login(req.user);
  }

  @Post('loginRecaptcha')
  @SetRecaptchaOptions({
    response: (req) => req.body.recaptchaToken,
    action: 'Login',
    score: 0.8,
  })
  @UseGuards(GoogleRecaptchaGuard, LocalAuthGuard)
  async loginRecaptcha(
    @RecaptchaResult() recaptchaResult: GoogleRecaptchaValidationResult,
    @Request() req,
    @Body() model: UserLoginDto,
  ) {
    console.log(
      `Action: ${recaptchaResult.action} Score: ${recaptchaResult.score}`,
    );
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  async getProfile(@Request() req) {
    const { username } = req.user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = await this.userService.findOne(username);
    return result;
  }
}
