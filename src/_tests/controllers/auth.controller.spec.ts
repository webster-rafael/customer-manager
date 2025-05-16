import { FastifyReply, FastifyRequest } from "fastify";
import { AuthController } from "../../../src/controllers/auth.controller";
import { AuthService } from "../../../src/services/auth.service";

jest.mock("../../../src/services/auth.service");

describe("AuthController", () => {
  const controller = new AuthController();

  const mockRequest = {
    body: { username: "testuser", password: "123456" },
  } as FastifyRequest;

  const send = jest.fn();
  const status = jest.fn().mockReturnValue({ send });
  const jwtSign = jest.fn();

  const mockReply = {
    send,
    status,
    jwtSign,
  } as unknown as FastifyReply;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve efetuar login com sucesso e retornar o token", async () => {
    const token = "fake-jwt-token";

    (AuthService.prototype.login as jest.Mock).mockResolvedValue(undefined);
    jwtSign.mockResolvedValue(token);

    await controller.login(mockRequest, mockReply);

    expect(AuthService.prototype.login).toHaveBeenCalledWith("testuser", "123456");
    expect(jwtSign).toHaveBeenCalledWith({ username: "testuser" });
    expect(send).toHaveBeenCalledWith({ token });
  });

  it("deve retornar 401 se as credenciais forem inválidas", async () => {
    (AuthService.prototype.login as jest.Mock).mockRejectedValue(new Error("Invalid credentials"));

    await controller.login(mockRequest, mockReply);

    expect(status).toHaveBeenCalledWith(401);
    expect(send).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });
});
