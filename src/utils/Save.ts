import supabase from "@/api/supabaseClient";

/**
 * Saves an item to the inventory with associated images.
 *
 * @param {FormData} data - The data for the item to be saved.
 * @param {string[]} imageUrls - The URLs of the images associated with the item.
 * @returns {Promise<void>} - A promise that resolves when the item is saved successfully.
 * @throws {Error} - If there is an error saving the item.
 */
const saveItem = async (
  data: {
    name: string;
    description: string;
    quantity: number;
    category: string;
  },
  imageUrls: string[]
): Promise<void> => {
  const { error } = await supabase
    .from("inventory")
    .insert([
      {
        name: data.name,
        description: data.description,
        quantity: data.quantity,
        category: data.category,
        images: imageUrls,
      },
    ]);

  if (error) {
    console.error("Erro ao salvar o item:", error);
    throw new Error("Erro ao salvar o item");
  }
};

export default saveItem;
