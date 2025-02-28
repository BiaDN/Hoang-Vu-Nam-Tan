import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertTbPosts1740561655766 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO tb_post (title, description, paragraphs, user_id) VALUES 
            ('Developer Language Coding', 'Developer Language' , '{"java", "python", "nodejs", "rust"}', 1),
            ('Animals', 'Animals In The Worlds' , '{"bird", "turtle", "lion", "eagle"}', 1)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM tb_post WHERE user_id = 1);
        `);
  }
}
