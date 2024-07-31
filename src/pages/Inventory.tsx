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
    setRefresh((prev) => !prev);
    } catch (error) {
      toast.error("Erro ao excluir o item");
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
