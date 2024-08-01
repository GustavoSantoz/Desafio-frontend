import * as z from "zod";

export const schemaAdd = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  quantity: z.number().min(1, "Quantidade deve ser pelo menos 1").nonnegative(),
  category: z.string().min(1, "Categoria é obrigatória"),
  images: z.array(z.string()).optional(),
});

export type ItemFormDataAdd = z.infer<typeof schemaAdd>;
