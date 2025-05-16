import { MigrationInterface, QueryRunner } from "typeorm";

export class AddActiveAndTimestampsToCustomer1747429953497
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "customers"
      ADD "active" boolean DEFAULT true,
      ADD "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "customers"
      DROP COLUMN "active",
      DROP COLUMN "created_at",
      DROP COLUMN "updated_at"
    `);
  }
}
