import { NextFunction, Request, Response } from "express";
import { FORBIDDEN } from "http-status";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
  if (!user) return res.status(FORBIDDEN);
  return next();
};

export default requireUser;
