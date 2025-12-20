import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeVarcharLength1766271157079 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "cover_image" TYPE character varying(900)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" ALTER COLUMN "cover_image" TYPE character varying(800)`,
    );
  }
}
