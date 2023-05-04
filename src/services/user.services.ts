import { hashSync } from "bcrypt";
import { env } from "process";

export function hashPassword(input: string): string {
    const rounds = Number(env.SALT)
    const hashed = hashSync(input, rounds)
    return hashed
}