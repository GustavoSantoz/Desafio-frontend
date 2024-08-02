import { create } from "zustand";
import supabase from "@/Supabase/supabaseClient";
import { toast } from "react-toastify";
import { uploadImages } from "@/utils/uploadsImages";
import { FormData as ItemFormDataAdd } from "@/schemas/schemaAdd";

interface AddStoreState {
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  addItem: (data: ItemFormDataAdd) => Promise<void>;
}

const displayToast = (
  toastType: "success" | "error",
  toastMessage: string,
  toastId: string
) => {
  toast.dismiss(toastId);
  toast[toastType](toastMessage, { toastId });
};

export const useAddStore = create<AddStoreState>((set, get) => ({
  selectedFiles: [],
  setSelectedFiles: (files) => set({ selectedFiles: files }),

  addItem: async (data: ItemFormDataAdd) => {
    try {
      const imageUrls = await uploadImages(get().selectedFiles);
      const { data: newItem, error: addItemError } = await supabase
        .from("items")
        .insert({
          ...data,
          images: imageUrls,
        })
        .select("*")
        .single();

      if (addItemError) {
        throw new Error(`Erro ao adicionar o item: ${addItemError.message}`);
      }

      const itemId = newItem?.id;

      if (itemId) {
        const { error: movementError } = await supabase
          .from("movements")
          .insert({
            itemId: itemId,
            date: new Date().toISOString(),
            origin: "Estoque Inicial",
            destination: data.location,
            quantity: data.quantity,
          });

        if (movementError) {
          throw new Error(
            `Erro ao registrar a movimentação: ${movementError.message}`
          );
        }
      }

      displayToast(
        "success",
        "Item e movimentação adicionados com sucesso!",
        "add-item-success"
      );
    } catch (error) {
      const TypedError = error as Error;
      displayToast(
        "error",
        `Erro ao adicionar o item e movimentação: ${TypedError.message}`,
        "add-item-error"
      );
    }
  },
}));
