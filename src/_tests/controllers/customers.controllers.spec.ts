import { FastifyRequest, FastifyReply } from "fastify";
import { CustomersUseCase } from "../../../src/usecases/customers.usecase";
import { listCustomersController } from "../../controllers/customers.controller";

jest.mock("../../../src/usecases/customers.usecase");

describe("listCustomersController", () => {
  it("deve retornar 200 e uma lista de clientes", async () => {
    const mockCustomers = [
      { id: 1, name: "João" },
      { id: 2, name: "Maria" },
    ];

    (CustomersUseCase as jest.Mock).mockImplementation(() => {
      return {
        findAll: jest.fn().mockResolvedValue(mockCustomers),
      };
    });

    const request = {} as FastifyRequest;
    const sendMock = jest.fn();
    const statusMock = jest.fn().mockReturnValue({ send: sendMock });
    const reply = { status: statusMock } as unknown as FastifyReply;

    await listCustomersController(request, reply);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(sendMock).toHaveBeenCalledWith(mockCustomers);
  });
});
