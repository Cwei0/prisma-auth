import { TypeOf, object, string } from "zod";

export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
    password: string({
      required_error: "Password is required",
    }),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
  }),
});
export type createSessionInput = TypeOf<typeof createSessionSchema>;
export type forgotPasswordInput = TypeOf<typeof forgotPasswordSchema>;
