import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

interface Payload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.header('auth-token');

    if (!token) throw new UnauthorizedException('Access Denied');

    const payload = this.jwtService.verify<Payload>(token, {
      secret: 'some-value',
    });

    req.userId = payload.userId;

    next();
  }
}
