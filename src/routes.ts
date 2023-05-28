import { Express, Request, Response } from "express";
import {
  createUserHandler,
  getCurrentLoggedinUser,
} from "./controllers/user.controller";
import { validate } from "./middlewares/validate";
import { createUserSchema } from "./schemas/user.schema";
import { createSessionSchema } from "./schemas/auth.schema";
import {
  createSessionHandler,
  getUserSessions,
} from "./controllers/auth.controller";
import requireUser from "./middlewares/requireUser";
function routes(app: Express) {
  app.get("/", (req: Request, res: Response) => {
    res.sendStatus(200);
  });

  app.post("/register", validate(createUserSchema), createUserHandler);
  app.post("/login", validate(createSessionSchema), createSessionHandler);

  app.get("/me", requireUser, getCurrentLoggedinUser);
  app.get("/sessions", requireUser, getUserSessions);
  
}

export default routes;
