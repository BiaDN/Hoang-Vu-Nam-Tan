import { hash } from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertTbUsers1740556667474 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const saltRounds = 10;
    const hashedPassword = await hash('024680', saltRounds);

    await queryRunner.query(`
            INSERT INTO tb_user (id, user_name, email, password, phone_number) VALUES 
            ('1', 'admin', 'admin@gmail.com', '${hashedPassword}', '0362082864'),
            ('2', 'user', 'user@gmail.com', '${hashedPassword}', '0362082864');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM tb_user WHERE id IN (1 ,2);
        `);
  }
}
