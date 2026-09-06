import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    // 1. Validasi user secara manual (tanpa AuthGuard 'local')
    const user = await this.authService.validateUser(body.username, body.password);
    
    if (!user) {
      throw new UnauthorizedException('Username atau password salah!');
    }

    // 2. Jika valid, buat token
    return this.authService.login(user);
  }
}
