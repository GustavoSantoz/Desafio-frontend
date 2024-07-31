import { useState, useEffect } from "react";
import supabase from "@/api/supabaseClient";
import { toast } from "react-toastify";
import SearchBar from "@/components/Inventory/Searchbar";
import ItemCard from "@/components/Inventory/ItemCard";
import ItemEditModal from "@/components/Inventory/EditModal";
import ItemFormModal from "@/components/Inventory/AddModal";
import { FormData } from "@/components/Inventory/EditModal";

interface Item {
  id: number;
  name: string;
  description: string;
  quantity: number;
  category: string;
  images: string[];
}

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from("items").select("*");

      if (error) {
        toast.error("Erro ao buscar itens: " + error.message);
      } else {
        setInventory(data || []);
      }
    };

    fetchItems();
  }, [refresh]);

  const handleItemAdded = () => {
    setRefresh((prev) => !prev);
  };

  const handleEditItem = (item: Item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveItem = async (data: FormData) => {
    try {
      const { error } = await supabase
        .from("items")
        .update({
          name: data.name,
          description: data.description,
          quantity: data.quantity,
          category: data.category,
        })
        .eq("id", data.id);

      if (error) {
        throw new Error(`Erro ao atualizar o item: ${error.message}`);
      }

      toast.success("Item atualizado com sucesso!");
      setRefresh((prev) => !prev);
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Erro ao atualizar o item");
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    try {
      const { data: item, error: fetchError } = await supabase
        .from("items")
        .select("images")
        .eq("id", itemId)
        .single();

      if (fetchError) {
        throw new Error(`Erro ao buscar o item: ${fetchError.message}`);
      }

      if (item.images) {
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

      toast.success("Item e imagens excluídos com sucesso!");
      setRefresh((prev) => !prev);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Erro ao excluir o item: ${error.message}`);
      } else {
        toast.error("Erro desconhecido ao excluir o item");
      }
    }
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-row-reverse justify-between items-center h-full w-full mb-6">
          <ItemFormModal onItemAdded={handleItemAdded} />
          <h1 className="text-2xl font-bold">Inventário</h1>
        </div>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredInventory.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
          />
        ))}
      </div>
      {selectedItem && (
        <ItemEditModal
          item={selectedItem}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveItem}
        />
      )}
    </div>
  );
}
