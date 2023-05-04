import { Express, Request, Response } from "express";
import { createUserHandler } from "./controllers/user.controller";
import { validate } from "./middlewares/validate";
import { createUserSchema } from "./schemas/user.schema";
function routes(app: Express) {
    app.get('/', (req: Request, res: Response) => {
        res.sendStatus(200)
    })

    app.post('/register', validate(createUserSchema), createUserHandler)
}

export default routes;