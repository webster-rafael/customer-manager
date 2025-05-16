import { Customer } from "../entity/Customer";

export interface CustomerRepository {
  findAll(): Promise<Customer[]>;
}
