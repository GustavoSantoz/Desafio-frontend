import * as z from "zod";

export const AuthSchema = z.object({
  email: z.string().email({ message: "Endereço de email invalido." }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export type FormData = z.infer<typeof AuthSchema>;
