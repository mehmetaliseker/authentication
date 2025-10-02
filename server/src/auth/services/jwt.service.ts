import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

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
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;

  constructor() {
    this.accessTokenExpiry = '24h';
    this.refreshTokenExpiry = '7d';
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'authentication-system-access-secret-2024';
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'authentication-system-refresh-secret-2024';
    
    console.log('JWT servisi başarıyla yapılandırıldı (sabit token sistemi)');
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
