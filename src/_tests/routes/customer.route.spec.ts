import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";
import { customerRoutes } from "../../../src/routes/customer.route";
import {
  createCustomerController,
  listCustomersController,
  updateCustomerController, // Adicione aqui
} from "../../../src/controllers/customers.controller";
import { CreateCustomers } from "../../interface/customer.interface";

interface Params {
  id: string;
}

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
  updateCustomerController: jest.fn(
    (
      request: FastifyRequest<{ Params: Params; Body: CreateCustomers }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const body = request.body;
      reply.code(200).send({ id, ...body });
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

  it("deve retornar 200 ao atualizar um cliente", async () => {
    const token = app.jwt.sign({ id: 1, email: "teste@teste.com" });

    const updatedPayload = {
      name: "Maria Atualizada",
      email: "maria.atualizada@example.com",
      phone: "987654321",
      address: {
        street: "Rua Atualizada",
        number: "101",
        neighborhood: "Bairro Novo",
        city: "São Paulo",
        state: "SP",
        zip_code: "01000-001",
      },
    };

    const response = await app.inject({
      method: "PUT",
      url: "/customers/2",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      payload: updatedPayload,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ id: "2", ...updatedPayload });
    expect(updateCustomerController).toHaveBeenCalled();
  });
});
