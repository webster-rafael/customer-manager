import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authRoutes } from "../../routes/auth.route";

describe("authRoutes", () => {
  let app: FastifyInstance;

  const mockLogin = jest.fn(
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      reply.code(200).send({ token: "fake-token" });
    }
  );

  beforeAll(async () => {
    app = Fastify();

    await app.register(authRoutes, {
      prefix: "/login",
      controller: { login: mockLogin },
    });

    await app.ready();
  });

  afterAll(() => app.close());

  it("deve responder 200 no POST / com credenciais válidas", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/login/",
      payload: { username: "user", password: "pass" },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ token: "fake-token" });
    expect(mockLogin).toHaveBeenCalled();
  });
});
