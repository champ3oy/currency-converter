import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { NonceService } from '../nonce/nonce.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly nonceService: NonceService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const isValidNonce = await this.nonceService.validateAndInvalidateNonce(
      payload.nonce,
    );
    if (!isValidNonce) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Generate new nonce and token
    const newNonce = await this.nonceService.generateNonce();
    const newToken = this.jwtService.sign({
      sub: payload.sub,
      email: payload.email,
      nonce: newNonce,
    });

    if (req.res) {
      req.res.setHeader('New-Access-Token', newToken);
      req.res.setHeader('Access-Control-Expose-Headers', 'New-Access-Token');
      req.res.locals = {
        newToken,
      };
    }

    return { userId: payload.sub, email: payload.email };
  }
}
