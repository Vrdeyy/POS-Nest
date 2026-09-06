import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. Ambil token dari header "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 2. Secret key ini harus sama persis dengan yang ada di AuthModule
      secretOrKey: process.env.JWT_SECRET || 'secretKey',
    });
  }

  // 3. Fungsi ini akan dipanggil otomatis kalau tokennya valid (belum expired & secret benar)
  async validate(payload: any) {
    // Return data apa saja yang ingin kamu tempelkan ke `req.user`
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
