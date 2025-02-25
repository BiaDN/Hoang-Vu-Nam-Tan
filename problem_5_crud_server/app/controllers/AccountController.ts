import { AccountService } from "@services/AccountService";
import { Request, Response } from "express";
import { LoginRequestDTO, LoginResponseDTO } from "./dto";
import { ResponseType } from "app/type";

export class AcountController {
  constructor() {

  }

  public static async login(req: Request, res: Response) {
    const result: ResponseType<LoginResponseDTO> = await AccountService.login(req.body as LoginRequestDTO)
    res.status(result.statusCode).json(result)
  }
}