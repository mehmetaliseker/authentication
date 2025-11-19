import { Body, Controller, Post, Param, Get, Req, UseGuards, Put, Query, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserLoginLogService } from '../services/user-login-log.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userLoginLogService: UserLoginLogService
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  logout(@Body() body: { userId: number }, @Req() req: Request) {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    return this.authService.logout(body.userId, ipAddress, userAgent);
  }

  @Post('refresh-token')
  refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password/:token')
  resetPassword(@Param('token') token: string, @Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(token, dto.password);
  }

  @Get('verify-reset-token/:token')
  verifyResetToken(@Param('token') token: string) {
    return this.authService.verifyResetToken(token);
  }

  @Put('update-profile')
  updateProfile(@Body() dto: UpdateProfileDto & { userId: number }) {
    return this.authService.updateProfile(dto.userId, dto);
  }


  @Post('firebase/verify')
  async verifyFirebaseToken(@Body() body: { idToken: string }) {
    return this.authService.verifyFirebaseToken(body.idToken);
  }

  @Get('login-stats/:userId')
  async getLoginStats(
    @Param('userId') userId: number,
    @Query('period') period: 'weekly' | 'monthly' | '6months' | 'yearly' = 'monthly'
  ) {
    return this.userLoginLogService.getLoginStats(userId, period);
  }

  @Get('login-stats/:userId/total')
  async getTotalLogins(@Param('userId') userId: number) {
    return this.userLoginLogService.getTotalLogins(userId);
  }

  @Get('login-stats/:userId/last')
  async getLastLogin(@Param('userId') userId: number) {
    return this.userLoginLogService.getLastLogin(userId);
  }

}