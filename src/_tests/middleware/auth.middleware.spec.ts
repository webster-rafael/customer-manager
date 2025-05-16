import { FastifyReply, FastifyRequest } from "fastify";
import { verifyJwt } from "../../../src/middleware/auth.middleware";

describe("verifyJwt middleware", () => {
  const send = jest.fn();
  const code = jest.fn().mockReturnValue({ send });
  const mockReply = { code } as unknown as FastifyReply;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve chamar jwtVerify quando o token for valido", async () => {
    const jwtVerify = jest.fn().mockResolvedValue(undefined);
    const mockRequest = { jwtVerify } as unknown as FastifyRequest;

    await verifyJwt(mockRequest, mockReply);

    expect(jwtVerify).toHaveBeenCalled();
    expect(code).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("deve responder com 401 se o token for inavlido", async () => {
    const jwtVerify = jest.fn().mockRejectedValue(new Error("Invalid token"));
    const mockRequest = { jwtVerify } as unknown as FastifyRequest;

    await verifyJwt(mockRequest, mockReply);

    expect(jwtVerify).toHaveBeenCalled();
    expect(code).toHaveBeenCalledWith(401);
    expect(send).toHaveBeenCalledWith({ message: "Invalid or missing token" });
  });
});
