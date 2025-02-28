export interface User {
  id?: number;
  email: string;
  password: string;
  url?: string;
}

export interface IRequestUserGetList {
  limit?: number;
  page?: number;
  userName?: string;
  email?: string;
  roleId?: string;
  createStartDate?: string;
  createEndDate?: string;
  sortBy?: string;
}
