import { Role, RoleType } from '@/interfaces/roles.interface';
import { BaseEntity, Entity, Column, CreateDateColumn, UpdateDateColumn, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { UserEntity } from './users.entity';

@Entity({ name: 'tb_role' })
export class RoleEntity extends BaseEntity implements Role {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: false, type: 'varchar', length: 200, name: 'role_name' })
  public roleName: RoleType;

  @ManyToMany(() => UserEntity, (user: UserEntity) => user?.roles)
  public users: UserEntity[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
