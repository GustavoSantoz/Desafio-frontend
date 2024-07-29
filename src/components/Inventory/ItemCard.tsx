"use client";

import { Button } from "@/components/ui/button";

interface Item {
  id: number;
  name: string;
  description: string;
  quantity: number;
  category: string;
  images: string[];
}

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  return (
    <div key={item.id} className="bg-slate-200 rounded-md shadow-sm overflow-hidden">
      <div className="relative w-full h-48">
        {item.images && item.images.length > 0 ? (
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <img
            src="/placeholder.svg"
            alt="Imagem de placeholder"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
        <p className="text-gray-500 mb-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-gray-700 font-semibold">Quantidade: {item.quantity}</p>
          <p className="text-primary font-semibold">{item.category}</p>
        </div>
        <Button variant="outline" className="w-full mt-4">
          Ver Detalhes
        </Button>
      </div>
    </div>
  );
};

export default ItemCard;
