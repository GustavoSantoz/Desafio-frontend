import { useState, useEffect } from "react";
import supabase from "@/api/supabaseClient";
import { toast } from "react-toastify";
import SearchBar from "@/components/Inventory/Searchbar";
import ItemCard from "@/components/Inventory/ItemCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
  }, []);

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-autopx-4 py-8">
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-row-reverse justify-between items-center h-full w-full mb-6">
          <Button variant="outline">
            <Link to="/add" className="ml-2">
              Adicionar um novo item
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Inventário</h1>
        </div>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredInventory.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
