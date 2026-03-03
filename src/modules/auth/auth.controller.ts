import {
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/singin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: SignupDto) {
    return this.authService.signUp(body.email, body.password);
  }
  @Post('signin')
  signIn(@Body() body: SigninDto) {
    return this.authService.signIn(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Headers('authorization') authHeader: string) {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization header');
    }
    const token = authHeader.replace('Bearer ', '');
    return this.authService.signOut(token);
  }
}
