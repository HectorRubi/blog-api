import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1766268849659 implements MigrationInterface {
  name = 'Init1766268849659';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "profile" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "avatar" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" text, "summary" character varying, "cover_image" character varying, "is_draft" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "profile_id" integer NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_f44d0cd18cfd80b0fed7806c3b" UNIQUE ("profile_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rel_post_categories" ("post_id" integer NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "PK_912adce0dd7462f62d9fa23f98e" PRIMARY KEY ("post_id", "category_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9c80fb88b0140f9f9f8b0fe54e" ON "rel_post_categories" ("post_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9969eeaaf8cb882b9a6bbe33f6" ON "rel_post_categories" ("category_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_52378a74ae3724bcab44036645b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_f44d0cd18cfd80b0fed7806c3b7" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rel_post_categories" ADD CONSTRAINT "FK_9c80fb88b0140f9f9f8b0fe54e8" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rel_post_categories" ADD CONSTRAINT "FK_9969eeaaf8cb882b9a6bbe33f60" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rel_post_categories" DROP CONSTRAINT "FK_9969eeaaf8cb882b9a6bbe33f60"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rel_post_categories" DROP CONSTRAINT "FK_9c80fb88b0140f9f9f8b0fe54e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_f44d0cd18cfd80b0fed7806c3b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_52378a74ae3724bcab44036645b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9969eeaaf8cb882b9a6bbe33f6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9c80fb88b0140f9f9f8b0fe54e"`,
    );
    await queryRunner.query(`DROP TABLE "rel_post_categories"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "post"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "profile"`);
  }
}
