import { AuthService } from "../../services/auth.service";

describe("AuthService", () => {
  const authService = new AuthService();

  it('deve retornar "valid" para credenciais corretas', async () => {
    const result = await authService.login("admin", "admin");
    expect(result).toBe("valid");
  });

  it("deve lançar erro para usuário incorreto", async () => {
    await expect(authService.login("invalid", "admin")).rejects.toThrow(
      "Usuário ou senha inválidos"
    );
  });

  it("deve lançar erro para senha incorreta", async () => {
    await expect(authService.login("admin", "wrongpass")).rejects.toThrow(
      "Usuário ou senha inválidos"
    );
  });
});
