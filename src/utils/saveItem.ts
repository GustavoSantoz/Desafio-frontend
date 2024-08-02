import supabase from "@/Supabase/supabaseClient";

export async function saveItem(item: {
  name: string;
  description: string;
  quantity: number;
  category: string;
  images: string[];
  location: string;
}) {
  const { name, description, quantity, category, images, location } = item;

  const { data: itemData, error: itemError } = await supabase
    .from("items")
    .insert([{ name, description, quantity, category, images, location }])
    .single(); 
  if (itemError) {
    throw new Error(`Erro ao salvar item: ${itemError.message}`);
  }

  if (itemData) {
    const { id: itemId } = itemData;

    const { error: movementError } = await supabase
      .from("movements")
      .insert([
        {
          itemId,
          location,
          quantity,
          type: "Added",
          date: new Date().toISOString(),
        },
      ]); 

    if (movementError) {
      throw new Error(
        `Erro ao registrar movimentação: ${movementError.message}`
      );
    }
  }

  return itemData;
}
