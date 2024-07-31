import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import supabase from "@/api/supabaseClient";

const schema = z.object({
  id: z.number().nonnegative(),
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  quantity: z.number().min(1, "Quantidade deve ser pelo menos 1").nonnegative(),
  category: z.string().min(1, "Categoria é obrigatória"),
});

export type FormData = z.infer<typeof schema>;

interface ItemEditModalProps {
  item: FormData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => void;
}

const ItemEditModal: React.FC<ItemEditModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: item,
  });

  useEffect(() => {
    reset(item); 
  }, [item, reset]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const { error } = await supabase
        .from("items")
        .update({
          name: data.name,
          description: data.description,
          quantity: data.quantity,
          category: data.category
        })
        .eq("id", data.id);

      if (error) {
        throw new Error(`Erro ao atualizar o item: ${error.message}`);
      }

      toast.success("Item atualizado com sucesso!");
      onSave(data); 
    } catch (error) {
      toast.error("Erro ao atualizar o item");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" {...register("description")} />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              type="number"
              id="quantity"
              {...register("quantity", { valueAsNumber: true })}
            />
            {errors.quantity && (
              <p className="text-red-500">{errors.quantity.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Input id="category" {...register("category")} />
            {errors.category && (
              <p className="text-red-500">{errors.category.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemEditModal;
