import { CustomersUseCase } from "../../usecases/customers.usecase";
import {
  CustomerRepository,
  CreateCustomers,
} from "../../interface/customer.interface";

describe("CustomersUseCase", () => {
  let useCase: CustomersUseCase;
  let mockCustomerRepo: jest.Mocked<CustomerRepository>;

  const fakeCustomers = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "123456789",
      address: {
        street: "Rua A",
        number: "1",
        neighborhood: "Centro",
        city: "SP",
        state: "SP",
        zip_code: "00000-000",
      },
    },
  ];

  beforeEach(() => {
    mockCustomerRepo = {
      findAll: jest.fn(),
      create: jest.fn(),
    };
    useCase = new CustomersUseCase(mockCustomerRepo);
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("deve retornar a lista de clientes em caso de sucesso", async () => {
    mockCustomerRepo.findAll.mockResolvedValue(fakeCustomers);

    const result = await useCase.findAll();

    expect(result).toEqual(fakeCustomers);
    expect(mockCustomerRepo.findAll).toHaveBeenCalled();
  });

  it("deve lançar erro e registrar quando o repositório lançar em findAll", async () => {
    const error = new Error("DB failure");
    mockCustomerRepo.findAll.mockRejectedValue(error);

    await expect(useCase.findAll()).rejects.toThrow("Error fetching customers");
    expect(mockCustomerRepo.findAll).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(expect.any(Error));
  });

  it("deve criar cliente com sucesso", async () => {
    const newCustomer: CreateCustomers = {
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "987654321",
      address: {
        street: "Rua B",
        number: "2",
        neighborhood: "Bairro",
        city: "SP",
        state: "SP",
        zip_code: "11111-111",
      },
    };

    const createdCustomer = { id: "2", ...newCustomer };
    mockCustomerRepo.create.mockResolvedValue(createdCustomer as any);

    const result = await useCase.create(newCustomer);

    expect(result).toEqual(createdCustomer);
    expect(mockCustomerRepo.create).toHaveBeenCalledWith(newCustomer);
  });

  it("deve lançar erro ao tentar criar cliente", async () => {
    const newCustomer: CreateCustomers = {
      name: "Erro",
      email: "erro@example.com",
      phone: "000000000",
      address: {
        street: "Rua C",
        number: "3",
        neighborhood: "Erro",
        city: "SP",
        state: "SP",
        zip_code: "22222-222",
      },
    };

    const error = new Error("DB insert error");
    mockCustomerRepo.create.mockRejectedValue(error);

    await expect(useCase.create(newCustomer)).rejects.toThrow(
      "Error creating customer"
    );
    expect(mockCustomerRepo.create).toHaveBeenCalledWith(newCustomer);
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
