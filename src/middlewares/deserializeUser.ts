import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt";
import { reissueAccesstoken } from "../services/session.service";
import { OK } from "http-status";

const deserializerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { accessT } = req.cookies;
    const { refreshT } = req.cookies;

    if (!accessT) return next()
    const { decoded, expired } = verifyJwt(accessT)

    if (decoded) {
        let { user } = res.locals
        user = decoded
        return next()
    }

    if(expired && refreshT) {
        const newAccessT : string = await reissueAccesstoken(refreshT)

        if(newAccessT) {
            res.cookie('accessT', newAccessT, {httpOnly: true, maxAge:60 * 60 *1000, sameSite:'strict'})
            res.status(OK).json({message: 'New accesstoken issued'})
        }

        const {decoded} = verifyJwt(newAccessT)

        if(decoded) {
            let {user} = res.locals
            user = decoded
            return next()
        }
    }
    return next()
}

export default deserializerUser