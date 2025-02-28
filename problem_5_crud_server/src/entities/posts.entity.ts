import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Index, RelationId, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { UserEntity } from './users.entity';

@Entity({ name: 'tb_post' })
export class PostEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public description: string;

  @Column('text', { array: true })
  public paragraphs: string[];

  @Index('post_userId_index')
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.posts)
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;

  @RelationId((post: PostEntity) => post.user)
  public userId: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
