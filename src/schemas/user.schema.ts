import { TypeOf, object, string } from "zod";

export const createUserSchema = object({
    body: object({
        Firstname: string({required_error: 'FirstName is required'}),
        Lastname: string({required_error: 'LastName is required'}),
        email: string({required_error: 'Email is required'}).email('Not a valid email'),
        password: string({required_error: 'Password is requird'}).min(6, 'Password is too short - should be 6 chars minimum'),
        confirmPassword: string({required_error: 'Confirm Password is required'}),
    }).refine((data) => data.password === data.confirmPassword, {
        message: 'Password do not match',
        path: ['confirmPassword']
    })
})

export type createUserInput = TypeOf<typeof createUserSchema>