import { compare, hashSync } from "bcrypt";
import { env } from "process";
import {
  createSessionInput,
  forgotPasswordInput,
} from "../schemas/auth.schema";
import db from "../config/db";
import { User } from "@prisma/client";

export function hashPassword(input: string): string {
  const rounds = Number(env.SALT);
  const hashed = hashSync(input, rounds);
  return hashed;
}

export async function validatePassword({
  email,
  password,
}: createSessionInput["body"]) {
  const user = await db.user.findUniqueOrThrow({
    where: {
      email,
    },
  });
  const isValid = await compare(password, user.password);
  if (!isValid) return false;

  return user;
}

export async function validateEmail({
  email,
}: forgotPasswordInput["body"]) {
  const user = await db.user.findUniqueOrThrow({
    where: {
      email,
    },
  });
  if (!user) {
    return false
  } 
  return user
}
