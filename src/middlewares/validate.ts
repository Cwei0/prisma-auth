import { NextFunction, Request, Response } from "express";
import { BAD_REQUEST } from "http-status";
import { AnyZodObject } from "zod";

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error) {
      return res.status(BAD_REQUEST).send(error);
    }
  };
