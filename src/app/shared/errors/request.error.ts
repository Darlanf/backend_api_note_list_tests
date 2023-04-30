import { Response } from "express";

export class RequestError {
  public static notProvided(
    res: Response,
    field: string
  ) {
    return res.status(400).send({
      ok: false,
      message: field + " nao informado",
    });
  }

  public static notFound(
    res: Response,
    entity: string
  ) {
    return res.status(404).send({
      ok: false,
      message: entity + " nao encontrado",
    });
  }

  public static invalidData(
    res: Response,
    message: string
  ) {
    return res.status(400).send({
      ok: false,
      message,
    });
  }

  public static unauthorized(res: Response) {
    return res.status(401).send({
      ok: false,
      message: "Acesso nao autorizado",
    });
  }

  public static forbidden(res: Response) {
    return res.status(403).send({
      ok: false,
      message: "Acesso nao autorizado",
    });
  }
}
