import { IAuthService } from "../interface/auth.service.interface";

export class AuthService implements IAuthService {
  async login(username: string, password: string): Promise<string> {

    if (username !== "admin" || password !== "admin") {
      throw new Error("Usuário ou senha inválidos");
    }

    return "valid"; // valor simbólico, token real será criado no controller
  }
}
