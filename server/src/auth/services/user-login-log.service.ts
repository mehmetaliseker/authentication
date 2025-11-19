import { Injectable } from '@nestjs/common';
import { UserLoginLogRepository } from '../repositories/user-login-log.repository';
import { CreateUserLoginLogDto, LoginStatsDto } from '../interfaces/user-login-log.interface';

@Injectable()
export class UserLoginLogService {
  constructor(private readonly userLoginLogRepository: UserLoginLogRepository) {}

  async createLoginLog(createDto: CreateUserLoginLogDto): Promise<void> {
    await this.userLoginLogRepository.create(createDto);
  }

  async getLoginStats(userId: number, period: 'weekly' | 'monthly' | '6months' | 'yearly'): Promise<LoginStatsDto> {
    return await this.userLoginLogRepository.getLoginStats(userId, period);
  }

  async getTotalLogins(userId: number): Promise<number> {
    return await this.userLoginLogRepository.getTotalLogins(userId);
  }

  async getLastLogin(userId: number): Promise<any> {
    return await this.userLoginLogRepository.getLastLogin(userId);
  }


  async getUserLoginHistory(userId: number, limit: number = 100): Promise<any[]> {
    return await this.userLoginLogRepository.findByUserId(userId, limit);
  }
}
