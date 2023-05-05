import { Request, Response } from "express";
import { validatePassword } from "../services/user.services";
import { createSessionInput } from "../schemas/session.schema";
import { OK, UNAUTHORIZED } from "http-status";
import { createSession } from "../services/session.service";
import { signJwt } from "../utils/jwt";

export const createSessionHandler = async (req: Request<{}, {}, createSessionInput['body']>, res: Response) => {
    const validUser = await validatePassword(req.body)
    if (!validUser) return res.status(UNAUTHORIZED).json({message: 'Invalid credentials'})

    const session = await createSession(validUser.id, req.headers["user-agent"] || "")

    const accessToken = signJwt(session.id, {expiresIn: "1h"})
    const refreshToken = signJwt(session.id, {expiresIn: "1d"})

    return (
        res.cookie('accessT', accessToken, {httpOnly: true, maxAge:60 * 60 *1000, sameSite:'strict'}),
        res.cookie('refreshT', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: "strict" }),
        res.json({message: 'Access and refresh Token generated'}).status(OK)
    )
}