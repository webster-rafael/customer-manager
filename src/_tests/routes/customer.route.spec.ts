import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";
import { customerRoutes } from "../../../src/routes/customer.route";
import {
  createCustomerController,
  listCustomersController,
} from "../../../src/controllers/customers.controller";

jest.mock("../../../src/controllers/customers.controller", () => ({
  listCustomersController: jest.fn(
    (request: FastifyRequest, reply: FastifyReply) => {
      reply.code(200).send([{ id: 1, name: "João" }]);
    }
  ),
  createCustomerController: jest.fn(
    (request: FastifyRequest, reply: FastifyReply) => {
      reply.code(201).send({ id: 2, name: "Maria" });
    }
  ),
}));

describe("customerRoutes", () => {
  const secret = "keysecret123";
  let app: ReturnType<typeof Fastify>;

  beforeAll(async () => {
    app = Fastify();

    app.register(fastifyJwt, { secret });

    app.addHook("onRequest", async (request: FastifyRequest) => {
      request.user = { id: 1, email: "teste@teste.com" };
    });

    await app.register(customerRoutes, { prefix: "/customers" });
  }, 10000);

  afterAll(() => app.close());

  it("deve retornar 200 e uma lista de clientes", async () => {
    const token = app.jwt.sign({ id: 1, email: "teste@teste.com" });

    const response = await app.inject({
      method: "GET",
      url: "/customers",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([{ id: 1, name: "João" }]);
    expect(listCustomersController).toHaveBeenCalled();
  });

  it("deve retornar 201 ao criar um cliente", async () => {
    const token = app.jwt.sign({ id: 1, email: "teste@teste.com" });

    const response = await app.inject({
      method: "POST",
      url: "/customers",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: {
        name: "Maria",
        email: "maria@example.com",
        phone: "123456789",
        address: {
          street: "Rua das Flores",
          number: "100",
          neighborhood: "Centro",
          city: "São Paulo",
          state: "SP",
          zip_code: "01000-000",
        },
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual({ id: 2, name: "Maria" });
    expect(
      require("../../../src/controllers/customers.controller")
        .createCustomerController
    ).toHaveBeenCalled();
  });
});
