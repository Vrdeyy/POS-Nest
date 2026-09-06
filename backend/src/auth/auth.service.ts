import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 1. Memvalidasi user berdasarkan username dan password
  async validateUser(username: string, password: string): Promise<any> {
    // Cari user di database
    const user = await this.usersService.findOneByUsername(username);
    
    // Jika tidak ada, kembalikan null
    if (!user) return null;
    
    // Bandingkan password input dengan password di database yang di-hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (isPasswordValid) {
      // Hapus field password agar tidak ter-return atau masuk ke token
      const { password: _, ...result } = user;
      return result;
    }
    
    return null;
  }
    
  // 2. Fungsi Login untuk men-generate JWT Token
  async login(user: any) {
    // Data (payload) apa saja yang mau kita simpan di dalam JWT token
    const payload = { username: user.username, sub: user.id, role: user.role };
    
    // Kembalikan token
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
