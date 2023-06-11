import { Request, Response } from "express";
import { validateEmail, validatePassword } from "../services/user.services";
import {
  createSessionInput,
  forgotPasswordInput,
} from "../schemas/auth.schema";
import { OK, UNAUTHORIZED } from "http-status";
import {
  createSession,
  findUserSessions,
  generateOTP,
} from "../services/auth.service";
import { signJwt } from "../utils/jwt";
import { sendEmail } from "../utils/mailer";

export const createSessionHandler = async (
  req: Request<{}, {}, createSessionInput["body"]>,
  res: Response
) => {
  const validUser = await validatePassword(req.body);
  if (!validUser)
    return res.status(UNAUTHORIZED).json({ message: "Invalid credentials" });

  const session = await createSession(
    validUser.id,
    req.headers["user-agent"] || ""
  );

  const accessToken = signJwt(session.id, { expiresIn: "1m" });
  const refreshToken = signJwt(session.id, { expiresIn: "2d" });

  return (
    res.cookie("accessT", accessToken, {
      httpOnly: true,
      sameSite: "strict",
    }),
    res.cookie("refreshT", refreshToken, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    }),
    res.json({ message: "Access and refresh Token generated" }).status(OK)
  );
};

export async function getUserSessions(req: Request, res: Response) {
  const sessionId = res.locals.user.id;
  const userSessions = await findUserSessions(sessionId);
  res.json(userSessions);
}

export async function forgotPassword(
  req: Request<{}, {}, forgotPasswordInput["body"]>,
  res: Response
) {
  const registeredUser = await validateEmail(req.body);
  if (registeredUser === false)
    return res.status(UNAUTHORIZED).json({ message: "User does not exist" });
  const userOtp = generateOTP();
  // Add userotp to redis, after watching the video
  const userEmail = registeredUser.email
  return sendEmail(userEmail, userOtp)
}

export async function resetPassword() {
  // Extract the user's ID or email from the query parameter or request
  // Retrieve the stored token from Redis using the user's ID or email as the key
  // Check if the token is valid and matches the one stored in Redis
    // Token is valid, proceed to the next middleware/handler
    // Token is invalid, redirect or display an error message
}