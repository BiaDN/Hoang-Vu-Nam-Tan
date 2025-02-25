import { LoginRequestDTO, LoginResponseDTO } from "@controllers/dto";
import { ResponseType } from "app/type";
import { StatusCodes } from "http-status-codes";
export class AccountService {
  constructor() {

  }

  public static async login(data: LoginRequestDTO): Promise<ResponseType<LoginResponseDTO>> {
    return {
      data: {
        username: '',
        email: '',
        phoneNumber: '',
        accessToken: '',
      },
      statusCode: StatusCodes.OK,
      message: "Login success"
    }
  }
}