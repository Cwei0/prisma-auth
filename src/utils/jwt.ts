import { JwtPayload, SignOptions, sign, verify } from "jsonwebtoken";
import { env } from "process";
import "dotenv/config";

export const signJwt = (id: string, options?:SignOptions) => {
    const payload = {id};
    return sign(payload, env.ACCESS_TOKEN!, options)
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