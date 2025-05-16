import { CustomersUseCase } from "../../usecases/customers.usecase";

describe("CustomersUseCase", () => {
  let useCase: CustomersUseCase;
  let mockCustomerRepo: any;

  beforeEach(() => {
    mockCustomerRepo = {
      findAll: jest.fn(),
    };
    useCase = new CustomersUseCase(mockCustomerRepo);
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("deve retornar a lista de clientes em caso de sucesso", async () => {
    const fakeCustomers = [
      { id: "1", name: "John Doe", email: "john@example.com" },
    ];

    mockCustomerRepo.findAll.mockResolvedValue(fakeCustomers);

    const result = await useCase.findAll();

    expect(result).toEqual(fakeCustomers);
    expect(mockCustomerRepo.findAll).toHaveBeenCalled();
  });

  it("deve lançar erro e registrar quando o repositório lançar", async () => {
    const error = new Error("DB failure");
    mockCustomerRepo.findAll.mockRejectedValue(error);

    await expect(useCase.findAll()).rejects.toThrow("Error fetching customers");
    expect(mockCustomerRepo.findAll).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(error);
  });
});
