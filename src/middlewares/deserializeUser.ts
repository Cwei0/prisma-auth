import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt";
import { reissueAccesstoken } from "../services/session.service";
import { OK } from "http-status";
import log from "../utils/logger";

const deserializerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { accessT } = req.cookies;
    
    if (!accessT) return next()
    const { decoded, expired } = verifyJwt(accessT)
    
    if (decoded) {
        res.locals.user = decoded;
        return next()
    }
    
    const { refreshT } = req.cookies;
    if(expired && refreshT) {
        const newAccessT : string = await reissueAccesstoken(refreshT)
        log.info("New access Token: ", newAccessT)

        if(newAccessT) {
            res.cookie('accessT', newAccessT, {httpOnly: true, maxAge:2* 60 *1000, sameSite:'strict'})
        }

        const {decoded} = verifyJwt(newAccessT)

        if(decoded) {
            res.locals.user = decoded;
            return next()
        }
    }
    return next()
}

export default deserializerUser