import { Session } from "@prisma/client";
import db from "../config/db"
import { signJwt, verifyJwt } from "../utils/jwt";

export const createSession = async (userId: string, userAgent: string) => {
    try {
        const newSession = await db.session.create({
            data:{
                userId,
                userAgent
            }
        })
        return newSession
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function reissueAccesstoken(token: string): Promise<string | false | any> {
    const {decoded} = verifyJwt(token);
    if(!decoded) return false

    const session : Session = await db.session.findUniqueOrThrow({
        where: {
            id: decoded.id
        }
    })
    if (!session) return false
    const reIssuedAccesstoken = signJwt(session.id, {expiresIn: "1h"})

    return reIssuedAccesstoken
}

export const findUserSessions = async (id: string) => {
    const session = await db.session.findUniqueOrThrow({
        where: {
            id,
        },
        select: {
            user: {
                select: {
                    sessions: true
                }
            }
        }
    })

    return session
}

export async function findSessionUser(id: string) {
    const sessionUser = await db.session.findUnique({
        where: {
            id,
        },
        select: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            }
        }
    })

    return sessionUser
}