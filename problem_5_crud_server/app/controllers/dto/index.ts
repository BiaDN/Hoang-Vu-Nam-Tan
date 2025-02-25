export type LoginRequestDTO = {
  username: string;
  password: string;
}

export type LoginResponseDTO = {
  username: string;
  email: string;
  phoneNumber: string;
  accessToken: string;
}