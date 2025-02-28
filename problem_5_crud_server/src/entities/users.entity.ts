import { IsNotEmpty } from 'class-validator';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { User } from '@interfaces/users.interface';
import { RoleEntity } from './roles.entity';
import { PostEntity } from './posts.entity';
import { LocalFileEntity } from './localFiles.entity';

@Entity({ name: 'tb_user' })
export class UserEntity extends BaseEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @Unique(['email'])
  email: string;

  @Column({ name: 'user_name' })
  @IsNotEmpty()
  userName: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column({ name: 'score', default: 0, type: 'integer' })
  scores: number;

  @Column({ name: 'phone_number' })
  @IsNotEmpty()
  phoneNumber: string;

  @JoinColumn({ name: 'avatar_id' })
  @OneToOne(() => LocalFileEntity, {
    nullable: true,
  })
  public avatar?: LocalFileEntity;

  @Column({ default: false, name: 'is_email_confirmed' })
  public isEmailConfirmed: boolean;

  @Column({ default: false, name: 'is_phone_number_confirmed' })
  public isPhoneNumberConfirmed: boolean;

  @Column({ default: false, name: 'delete_yn' })
  public deleteYn: boolean;

  @ManyToMany(() => RoleEntity, (role: RoleEntity) => role.users, { eager: false })
  @JoinTable({
    name: 'tb_user_role',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  public roles: RoleEntity[];

  @OneToMany(() => PostEntity, (post: PostEntity) => post.user)
  public posts?: PostEntity[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
