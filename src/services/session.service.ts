import db from "../config/db"

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