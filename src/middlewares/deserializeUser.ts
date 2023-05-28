import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt";
import { reissueAccesstoken } from "../services/session.service";
import { OK } from "http-status";
import log from "../utils/logger";

const deserializerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accessT } = req.cookies;
  const { refreshT } = req.cookies;

  if (!accessT) return next();
  const { decoded, expired } = verifyJwt(accessT);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshT) {
    const newAccessT: string = await reissueAccesstoken(refreshT);

    if (newAccessT) {
      res.cookie("accessT", newAccessT, {
        httpOnly: true,
        sameSite: "strict",
      });
    }
    const { decoded } = verifyJwt(newAccessT);

    if (decoded) {
      res.locals.user = decoded;
      return next();
    }
  }
  return next();
};

export default deserializerUser;
