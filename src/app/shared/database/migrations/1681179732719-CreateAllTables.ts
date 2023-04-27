import {
  MigrationInterface,
  QueryRunner,
} from "typeorm";

export class CreateAllTables1681179732719
  implements MigrationInterface
{
  name = "CreateAllTables1681179732719";

  public async up(
    queryRunner: QueryRunner
  ): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "avaliacao"."note" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "filed" boolean NOT NULL DEFAULT false, "id_user" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_96d0c172a4fba276b1bbed43058" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "avaliacao"."user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(30) NOT NULL, "email" character varying NOT NULL, "password" character varying(12) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "avaliacao"."note" ADD CONSTRAINT "FK_f4f182421a89338bdc432d6adf7" FOREIGN KEY ("id_user") REFERENCES "avaliacao"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(
    queryRunner: QueryRunner
  ): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "avaliacao"."note" DROP CONSTRAINT "FK_f4f182421a89338bdc432d6adf7"`
    );
    await queryRunner.query(
      `DROP TABLE "avaliacao"."user"`
    );
    await queryRunner.query(
      `DROP TABLE "avaliacao"."note"`
    );
  }
}
