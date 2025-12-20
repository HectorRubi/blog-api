import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewFields1766269617740 implements MigrationInterface {
  name = 'NewFields1766269617740';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "categories" ADD "description" text`);
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "cover_image" character varying(800)`,
    );
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "cover_image"`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD "cover_image" character varying(800)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "cover_image"`);
    await queryRunner.query(
      `ALTER TABLE "post" ADD "cover_image" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" DROP COLUMN "cover_image"`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" DROP COLUMN "description"`,
    );
  }
}
