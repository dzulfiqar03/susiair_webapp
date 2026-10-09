import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.dto';

// Satu akun pilot di-hardcode sesuai brief.
const PILOT = { id: 1, username: 'johndoe', password: 'susiairtest' };

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  async login(dto: LoginDto) {
    if (dto.username !== PILOT.username || dto.password !== PILOT.password) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const accessToken = await this.jwt.signAsync({
      sub: PILOT.id,
      username: PILOT.username,
    });
    return { accessToken, tokenType: 'Bearer' };
  }
}
