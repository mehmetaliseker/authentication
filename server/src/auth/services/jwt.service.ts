import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class JwtService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'your-super-secret-access-key';//..
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key';//..
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
  }

  generateTokenPair(payload: Omit<JwtPayload, 'iat' | 'exp'>): TokenPair {
    const accessToken = jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: 'auth-system',
      audience: 'auth-system-users'
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
      issuer: 'auth-system',
      audience: 'auth-system-users'
    } as jwt.SignOptions);

    return {
      accessToken,
      refreshToken
    };
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      const payload = jwt.verify(token, this.accessTokenSecret, {
        issuer: 'auth-system',
        audience: 'auth-system-users'
      });
      return payload as unknown as JwtPayload;
    } catch (error) {
      throw new Error('Geçersiz access token');
    }
  }

  verifyRefreshToken(token: string): JwtPayload {
    try {
      const payload = jwt.verify(token, this.refreshTokenSecret, {
        issuer: 'auth-system',
        audience: 'auth-system-users'
      });
      return payload as unknown as JwtPayload;
    } catch (error) {
      throw new Error('Geçersiz refresh token');
    }
  }

  generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: 'auth-system',
      audience: 'auth-system-users'
    } as jwt.SignOptions);
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      const payload = jwt.decode(token);
      return payload as unknown as JwtPayload;
    } catch (error) {
      return null;
    }
  }
}
