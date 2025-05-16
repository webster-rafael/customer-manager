import AppDataSource from "../../database/data-source";
import { Customer } from "../../entity/Customer";
import { CustomerTypeOrmRepository } from "../../repositories/customer.typeorm.repository";

describe("CustomerTypeOrmRepository", () => {
  let repo: CustomerTypeOrmRepository;
  let mockFind: jest.Mock;

  beforeEach(() => {
    repo = new CustomerTypeOrmRepository();
    mockFind = jest.fn();


    jest.spyOn(AppDataSource, "getRepository").mockReturnValue({
      find: mockFind,
    } as any);

    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("deve retornar uma lista de clientes", async () => {
    const fakeCustomers: Customer[] = [
      {
        id: "uuid-1",
        name: "John Doe",
        email: "john@example.com",
        phone: "123456789",
        address: {
          street: "Rua A",
          number: "100",
          neighborhood: "Centro",
          city: "Cidade",
          state: "Estado",
          zip_code: "12345-678",
        },
      },
    ];

    mockFind.mockResolvedValue(fakeCustomers);

    const customers = await repo.findAll();

    expect(customers).toEqual(fakeCustomers);
    expect(AppDataSource.getRepository).toHaveBeenCalledWith(Customer);
    expect(mockFind).toHaveBeenCalled();
  });

  it("deve lançar erro quando find lança", async () => {
    mockFind.mockRejectedValue(new Error("DB error"));

    await expect(repo.findAll()).rejects.toThrow("Error fetching customers");
    expect(AppDataSource.getRepository).toHaveBeenCalledWith(Customer);
    expect(mockFind).toHaveBeenCalled();
  });
});
