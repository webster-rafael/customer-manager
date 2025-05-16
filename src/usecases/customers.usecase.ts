import { CustomerRepository } from "../interface/customer.interface";

export class CustomersUseCase {
  constructor(private customerRepo: CustomerRepository) {}

  async findAll() {
    try {
      const data = await this.customerRepo.findAll();
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching customers");
    }
  }
}
