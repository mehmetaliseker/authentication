export interface AuthRepository {
  register(username: string, email: string, password: string, firstName: string, lastName: string): Promise<any>;
  validateUser(email: string, password: string): Promise<any>;
  login(email: string, password: string): Promise<any>;
  logout(token: string): Promise<{ success: boolean; message: string }>;
  hashPassword(password: string): Promise<string>;
}
