export interface UserLoginLog {
  id: number;
  user_id: number;
  login_time: Date;
  login_method: string;
  success: boolean;
}

export interface CreateUserLoginLogDto {
  user_id: number;
  login_time?: Date;
  login_method?: string;
  success?: boolean;
}

export interface LoginStatsDto {
  period: 'weekly' | 'monthly' | '6months' | 'yearly';
  data: {
    period: string;
    count: number;
  }[];
}
