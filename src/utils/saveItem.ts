import supabase from "@/api/supabaseClient";

export async function saveItem(item: {
  name: string;
  description: string;
  quantity: number;
  category: string;
  images: string[];
}) {
  const { name, description, quantity, category, images } = item;

  const { data, error } = await supabase
    .from("items")
    .insert([{ name, description, quantity, category, images }]);

  if (error) {
    throw new Error(`Erro ao salvar item: ${error.message}`);
  }

  return data;
}
