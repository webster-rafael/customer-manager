export interface IAuthService {
  login(username: string, password: string): Promise<string>;
}