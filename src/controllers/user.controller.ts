import { Request, Response } from "express";
import db from "../config/db";
import { CREATED, OK } from "http-status";
import { createUserInput } from "../schemas/user.schema";
import { hashPassword } from "../services/user.services";
import { BAD_REQUEST } from "http-status";
import { findSessionUser } from "../services/session.service";

export async function createUserHandler(
  req: Request<{}, {}, createUserInput["body"]>,
  res: Response
) {
  const { Firstname, Lastname, email, password } = req.body;
  try {
    const newUser = await db.user.create({
      data: {
        firstName: Firstname,
        lastName: Lastname,
        email,
        password: hashPassword(password),
      },
    });
    return res.json({ "✅": "New User created" }).status(CREATED);
  } catch (err) {
    return res.json({ message: err }).status(BAD_REQUEST);
  }
}

export async function getCurrentLoggedinUser(req: Request, res: Response) {
  const sessionId = res.locals.user.id;
  const user = await findSessionUser(sessionId);
  res.json(user);
}
