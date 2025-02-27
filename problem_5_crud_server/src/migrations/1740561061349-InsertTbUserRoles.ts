import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertTbUserRoles1740561061349 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO tb_user_role (user_id, role_id) VALUES 
            (1, 1),
            (1, 3),
            (2, 2)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM tb_user_role WHERE user_id IN (1, 2);
        `);
  }
}
