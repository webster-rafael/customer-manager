
import AppDataSource from "../database/data-source";
import { Customer } from "../entity/Customer";
import { CustomerRepository } from "../interface/customer.interface";

export class CustomerTypeOrmRepository implements CustomerRepository {
  async findAll(): Promise<Customer[]> {
    try {
      const data = await AppDataSource.getRepository(Customer).find();
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching customers")
    }
  }
}
