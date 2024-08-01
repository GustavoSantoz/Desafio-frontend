import create from "zustand";
import supabase from "@/Supabase/supabaseClient";
import { toast } from "react-toastify";
import { z } from "zod";

const schema = z.object({
  id: z.number().nonnegative(),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  quantity: z.number().min(1, "Quantidade deve ser pelo menos 1").nonnegative(),
  category: z.string().min(1, "Categoria é obrigatória"),
});

export type FormData = z.infer<typeof schema>;

interface ItemStore {
  item: FormData | null;
  isOpen: boolean;
  setItem: (item: FormData) => void;
  openModal: () => void;
  closeModal: () => void;
  updateItem: (data: FormData) => Promise<void>;
}

export const useItemStore = create<ItemStore>((set) => ({
  item: null,
  isOpen: false,
  setItem: (item) => set({ item }),
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  updateItem: async (data) => {
    try {
      const { error } = await supabase
        .from("items")
        .update({ ...data })
        .eq("id", data.id);

      if (error) {
        throw new Error(`Erro ao atualizar o item: ${error.message}`);
      }

      toast.success("Item atualizado com sucesso!");
    } catch {
      toast.error("Erro ao atualizar o item");
    }
  },
}));
