import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertTbRoles1740556403282 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO tb_role (id, role_name) VALUES 
            ('1', 'Admin'),
            ('2', 'User'),
            ('3', 'Moderator');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM tb_role WHERE id IN ('1', '2', '3');
        `);
  }
}
