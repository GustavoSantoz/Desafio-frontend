// detailStore.ts

import { useEffect, useState } from "react";
import supabase from "@/Supabase/supabaseClient";
import { Item, Movement } from "@/schemas/schemaDetail";

// Define um tipo para o retorno do hook
interface UseItemDetailsReturn {
  item: Item | null;
  mainImage: string | null;
  newLocation: string;
  movements: Movement[];
  origin: string;
  destination: string;
  movementQuantity: number;
  setNewLocation: React.Dispatch<React.SetStateAction<string>>;
  updateLocation: () => void;
  handleMovementSubmit: (e: React.FormEvent) => void;
  handleDeleteItem: () => void;
  handleImageClick: (image: string) => void;
  handleLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setOrigin: React.Dispatch<React.SetStateAction<string>>;
  setDestination: React.Dispatch<React.SetStateAction<string>>;
  setMovementQuantity: React.Dispatch<React.SetStateAction<number>>;
}

export function useItemDetails(id: string | undefined): UseItemDetailsReturn {
  const [item, setItem] = useState<Item | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [newLocation, setNewLocation] = useState<string>("");
  const [movements, setMovements] = useState<Movement[]>([]);
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [movementQuantity, setMovementQuantity] = useState<number>(0);

  useEffect(() => {
    const fetchItem = async () => {
      if (id) {
        const { data, error } = await supabase
          .from("items")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Erro ao buscar item:", error.message);
          return;
        }

        setItem(data);
        if (data?.images.length) {
          setMainImage(data.images[0]);
        }
        setNewLocation(data?.location || "");

        const { data: movementsData, error: movementsError } = await supabase
          .from("movements")
          .select("*")
          .eq("itemId", id);

        if (movementsError) {
          console.error(
            "Erro ao buscar movimentações:",
            movementsError.message
          );
          return;
        }

        setMovements(movementsData || []);
      }
    };

    fetchItem();
  }, [id]);

  const handleDeleteItem = async () => {
    try {
      if (item?.images && item.images.length > 0) {
        const { error: deleteImagesError } = await supabase.storage
          .from("items")
          .remove(item.images);

        if (deleteImagesError) {
          throw new Error(
            `Erro ao excluir imagens: ${deleteImagesError.message}`
          );
        }
      }

      const { error: deleteItemError } = await supabase
        .from("items")
        .delete()
        .eq("id", id);

      if (deleteItemError) {
        throw new Error(`Erro ao excluir o item: ${deleteItemError.message}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Erro ao excluir o item: ${error.message}`);
      } else {
        console.error("Erro desconhecido ao excluir o item");
      }
    }
  };

  const handleImageClick = (image: string) => {
    setMainImage(image);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLocation(e.target.value);
  };

  const updateLocation = async () => {
    if (item && newLocation !== item.location) {
      try {
        const { error } = await supabase
          .from("items")
          .update({ location: newLocation })
          .eq("id", item.id);

        if (error) {
          throw new Error(`Erro ao atualizar a localização: ${error.message}`);
        }

        setItem({ ...item, location: newLocation });
      } catch (error) {
        console.error(
          `Erro ao atualizar a localização: ${(error as Error).message}`
        );
      }
    }
  };

  const handleMovementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (item && origin && destination && movementQuantity > 0) {
      try {
        const { data, error } = await supabase
          .from("movements")
          .insert({
            itemId: item.id,
            date: new Date().toISOString(),
            origin,
            destination,
            quantity: movementQuantity,
          })
          .single();

        if (error) {
          throw new Error(`Erro ao registrar a movimentação: ${error.message}`);
        }

        setMovements([...movements, data]);
        setOrigin("");
        setDestination("");
        setMovementQuantity(0);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Erro ao registrar a movimentação: ${error.message}`);
        } else {
          console.error("Erro desconhecido ao registrar a movimentação");
        }
      }
    }
  };

  return {
    item,
    mainImage,
    newLocation,
    movements,
    origin,
    destination,
    movementQuantity,
    setNewLocation,
    updateLocation,
    handleMovementSubmit,
    handleDeleteItem,
    handleImageClick,
    handleLocationChange,
    setOrigin,
    setDestination,
    setMovementQuantity,
  };
}
