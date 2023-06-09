import { Session } from "@prisma/client";
import db from "../config/db";
import { signJwt, verifyJwt } from "../utils/jwt";
import { generate } from "otp-generator";

export const createSession = async (userId: string, userAgent: string) => {
  try {
    const newSession = await db.session.create({
      data: {
        userId,
        userAgent,
      },
    });
    return newSession;
  } catch (error: any) {
    throw new Error(error);
  }
};

export async function reissueAccesstoken(
  token: string
): Promise<string | false | any> {
  const { decoded } = verifyJwt(token);
  if (!decoded) {
    throw new Error("Decoded info unavailable");
  }

  const session: Session = await db.session.findUniqueOrThrow({
    where: {
      id: decoded.id,
    },
  });
  const reIssuedAccesstoken = signJwt(session.id, { expiresIn: "1m" });
  return reIssuedAccesstoken;
}

export const findUserSessions = async (id: string) => {
  const session = await db.session.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      user: {
        select: {
          sessions: true,
        },
      },
    },
  });

  return session;
};

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
      },
    },
  });

  return sessionUser;
}

export const generateOTP = () => {
  const randomNumber = Math.floor(Math.random() * 2);
  const userOtp = generate(6 + randomNumber, {
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  return userOtp;
};
