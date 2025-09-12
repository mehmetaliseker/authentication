import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    console.log('JWT Guard - Token kontrolü:', { 
      hasToken: !!token, 
      tokenLength: token?.length,
      url: request.url,
      method: request.method
    });
    
    if (!token) {
      console.log('JWT Guard - Token bulunamadı');
      throw new UnauthorizedException('Token bulunamadı');
    }

    try {
      const payload = this.jwtService.verifyAccessToken(token);
      console.log('JWT Guard - Token doğrulandı:', { userId: payload.sub, email: payload.email });
      request.user = { id: payload.sub, email: payload.email };
      return true;
    } catch (error) {
      console.log('JWT Guard - Token doğrulama hatası:', error.message);
      throw new UnauthorizedException('Geçersiz token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
