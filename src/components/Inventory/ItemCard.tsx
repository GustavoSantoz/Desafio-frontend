import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";

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
  onEdit: (item: Item) => void;
  onDelete: (itemId: number) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onEdit, onDelete }) => {
  return (
    <div
      key={item.id}
      className="relative bg-slate-200 rounded-md shadow-sm overflow-hidden"
    >
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
          <p className="text-gray-700 font-semibold">
            Quantidade: {item.quantity}
          </p>
          <p className="text-primary font-semibold">{item.category}</p>
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="w-full">
            Ver Detalhes
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onEdit(item)}
          >
            <Pencil />
          </Button>
          <button
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-700"
            onClick={() => onDelete(item.id)}
            aria-label="Excluir"
            title="Excluir Item"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
