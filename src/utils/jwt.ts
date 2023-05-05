import { JwtPayload, SignOptions, sign, verify } from "jsonwebtoken";
import { env } from "process";

export const signJwt = (id: string, options?:SignOptions | undefined) => {
    return sign(id, env.ACCESS_TOKEN!, {
        ...(options && options)
    })
}

export const verifyJwt = (token: string) : JwtPayload | string | any => {
    try {
        const decoded = verify(token, env.ACCESS_TOKEN!)
        return {
            valid: true,
            expried: false,
            decoded
        }
    } catch (error: any) {
        return {
            valid: false,
            expired: error.message === 'JWT expired',
            decoded: null
        }
    }
}