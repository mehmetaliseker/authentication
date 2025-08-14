export interface AuthRepository {
  register(username: string, password: string): Promise<any>;
  validateUser(username: string, password: string): Promise<any>;
  login(username: string, password: string): Promise<any>;
  logout(username: string): Promise<{ success: boolean; message: string }>;
  hashPassword(password: string): Promise<string>;
}