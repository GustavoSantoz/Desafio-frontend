import { create } from "zustand";
import supabase from "@/Supabase/supabaseClient";
import { toast } from "react-toastify";

interface Item {
  id: number;
  name: string;
  description: string;
  quantity: number;
  category: string;
  images: string[];
}

interface FormData {
  id: number;
  name: string;
  description: string;
  quantity: number;
  category: string;
  location: string;
}

interface InventoryState {
  inventory: Item[];
  selectedItem: Item | null;
  isEditModalOpen: boolean;
  searchTerm: string;
  fetchItems: () => Promise<void>;
  handleItemAdded: () => Promise<void>;
  handleEditItem: (item: Item) => void;
  handleSaveItem: (data: FormData) => Promise<void>;
  handleDeleteItem: (itemId: number) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setIsEditModalOpen: (open: boolean) => void;
}

const displayToast = (
  toastType: "success" | "error",
  toastMessage: string,
  toastId: string
) => {
  toast.dismiss(toastId);
  toast[toastType](toastMessage, { toastId });
};

export const useInventoryStore = create<InventoryState>((set, get) => ({
  inventory: [],
  selectedItem: null,
  isEditModalOpen: false,
  searchTerm: "",

  fetchItems: async () => {
    try {
      const { data, error } = await supabase.from("items").select("*");
      if (error) {
        displayToast(
          "error",
          "Erro ao buscar itens: " + error.message,
          "fetch-items-error"
        );
      } else {
        set({ inventory: data || [] });
      }
    } catch (error) {
      displayToast("error", "Erro ao buscar itens", "fetch-items-error");
    }
  },

  handleItemAdded: async () => {
    await get().fetchItems();
  },

  handleEditItem: (item) => set({ selectedItem: item, isEditModalOpen: true }),

  handleSaveItem: async (data) => {
    try {
      const { error } = await supabase
        .from("items")
        .update({
          name: data.name,
          description: data.description,
          quantity: data.quantity,
          category: data.category,
          location: data.location,
        })
        .eq("id", data.id);

      if (error) {
        throw new Error(`Erro ao atualizar o item: ${error.message}`);
      }

      displayToast(
        "success",
        "Item atualizado com sucesso!",
        "update-item-success"
      );
      await get().fetchItems();
      set({ isEditModalOpen: false });
    } catch (error) {
      displayToast("error", "Erro ao atualizar o item", "update-item-error");
    }
  },

  handleDeleteItem: async (itemId: number) => {
    try {
      const { data: item, error: fetchError } = await supabase
        .from("items")
        .select("images")
        .eq("id", itemId)
        .single();

      if (fetchError) {
        throw new Error(`Erro ao buscar o item: ${fetchError.message}`);
      }

      if (item.images && item.images.length > 0) {
        const imagePaths = item.images;

        const { error: deleteImagesError } = await supabase.storage
          .from("items")
          .remove(imagePaths);

        if (deleteImagesError) {
          throw new Error(
            `Erro ao excluir imagens: ${deleteImagesError.message}`
          );
        }
      }

      const { error: deleteItemError } = await supabase
        .from("items")
        .delete()
        .eq("id", itemId);

      if (deleteItemError) {
        throw new Error(`Erro ao excluir o item: ${deleteItemError.message}`);
      }

      displayToast(
        "success",
        "Item e imagens excluídos com sucesso!",
        "delete-item-success"
      );

      await get().fetchItems();
    } catch (error) {
      if (error instanceof Error) {
        displayToast(
          "error",
          `Erro ao excluir o item: ${error.message}`,
          "delete-item-error"
        );
      } else {
        displayToast(
          "error",
          "Erro desconhecido ao excluir o item",
          "delete-item-error"
        );
      }
    }
  },

  setSearchTerm: (term) => set({ searchTerm: term }),

  setIsEditModalOpen: (open) => set({ isEditModalOpen: open }),
}));
