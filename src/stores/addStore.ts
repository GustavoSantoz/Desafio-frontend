import { create } from "zustand";
import supabase from "@/Supabase/supabaseClient";
import { toast } from "react-toastify";
import { uploadImages } from "@/utils/uploadsImages";
import { ItemFormDataAdd } from "@/schemas/schemaAdd";

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
      const { error } = await supabase
        .from("items")
        .insert({
          ...data,
          images: imageUrls,
        });

      if (error) {
        throw new Error(`Erro ao adicionar o item: ${error.message}`);
      }

      displayToast(
        "success",
        "Item adicionado com sucesso!",
        "add-item-success"
      );
    } catch (error) {
        const TypedError = error as Error;
      displayToast(
        "error",
        `Erro ao adicionar o item: ${TypedError.message}`,
        "add-item-error"
      );
    }
  },
}));
