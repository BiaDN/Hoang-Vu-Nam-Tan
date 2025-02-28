export enum RoleType {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'Moderator',
}

export interface Role {
  id?: number;
  roleName: RoleType;
}
