import * as z from "zod";

export const editItemSchema = z.object({
  id: z.number().nonnegative(),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  quantity: z.number().min(1, "Quantidade deve ser pelo menos 1").nonnegative(),
  category: z.string().min(1, "Categoria é obrigatória"),
  location: z.string().min(1, "Localização é obrigatória"),
});

export type EditItemFormData = z.infer<typeof editItemSchema>;
