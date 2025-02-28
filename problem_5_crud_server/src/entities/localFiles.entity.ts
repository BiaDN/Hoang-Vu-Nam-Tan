import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tb_local_file' })
export class LocalFileEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  mimetype: string;
}
