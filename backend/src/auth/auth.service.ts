import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { NonceService } from '../nonce/nonce.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly nonceService: NonceService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      const newUser = await this.usersService.createUser(
        loginDto.email,
        loginDto.password,
      );
      const nonce = await this.nonceService.generateNonce();

      const payload = {
        sub: newUser.id,
        email: newUser.email,
        nonce,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: newUser.id,
          email: newUser.email,
        },
      };
    }

    const nonce = await this.nonceService.generateNonce();

    const payload = {
      sub: user.id,
      email: user.email,
      nonce,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
