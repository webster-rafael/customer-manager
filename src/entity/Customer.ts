import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("customers")
export class Customer {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  name?: string;

  @Column()
  email?: string;

  @Column()
  phone?: string;

  @Column({ default: true })
  active?: boolean;

  @Column({ type: "jsonb", nullable: true })
  address?: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
  };

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at?: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at?: Date;
}
