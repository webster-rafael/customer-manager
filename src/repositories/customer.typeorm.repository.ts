import AppDataSource from "../database/data-source";
import { Customer } from "../entity/Customer";
import {
  CreateCustomers,
  CustomerRepository,
} from "../interface/customer.interface";

export class CustomerTypeOrmRepository implements CustomerRepository {
  async create({
    name,
    email,
    phone,
    address,
  }: CreateCustomers): Promise<Customer> {
    try {
      const repo = AppDataSource.getRepository(Customer);
      const customer = repo.create({
        name,
        email,
        phone,
        address,
      });
      await repo.save(customer);
      return customer;
    } catch (error) {
      console.log(error);
      throw new Error("Error creating customer");
    }
  }

  async findAll(): Promise<Customer[]> {
    try {
      const data = await AppDataSource.getRepository(Customer).find();
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching customers");
    }
  }

  async update(id: string, data: CreateCustomers): Promise<Customer> {
    try {
      const repo = AppDataSource.getRepository(Customer);
      const customer = await repo.findOneBy({ id });
      if (!customer) {
        throw new Error("Customer not found");
      }
      customer.name = data.name;
      customer.email = data.email;
      customer.phone = data.phone;
      customer.address = data.address;
      await repo.save(customer);
      return customer;
    } catch (error) {
      console.log(error);
      throw new Error("Error updating customer");
    }
  }
}
