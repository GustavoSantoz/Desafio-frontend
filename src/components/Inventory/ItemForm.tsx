import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { uploadImages } from "@/utils/uploadsImages";
import supabase from "@/api/supabaseClient";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  quantity: z.number().min(1, "Quantidade deve ser pelo menos 1").nonnegative(),
  category: z.string().min(1, "Categoria é obrigatória"),
});

type FormData = z.infer<typeof schema>;

interface ItemFormModalProps {
  onItemAdded: () => void;
}

const ItemFormModal: React.FC<ItemFormModalProps> = ({ onItemAdded }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const imageUrls = await uploadImages(selectedFiles);
      await saveItem({ ...data, images: imageUrls });
      toast.success("Item cadastrado com sucesso!");
      onItemAdded();
    } catch (error) {
      toast.error("Erro ao cadastrar o item");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Adicionar Novo Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastro de Item</DialogTitle>
          <DialogDescription>
            Preencha o formulário abaixo para cadastrar um novo item.
          </DialogDescription>
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
          <div>
            <Label htmlFor="images">Imagens</Label>
            <Input
              type="file"
              id="images"
              multiple
              onChange={handleFileChange}
            />
          </div>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Fechar
              </Button>
            </DialogClose>
            <Button type="submit" className="ml-2">
              Cadastrar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

async function saveItem(item: FormData & { images: string[] }) {
  const { name, description, quantity, category, images } = item;

  const { data, error } = await supabase
    .from("items")
    .insert([{ name, description, quantity, category, images }]);

  if (error) {
    throw new Error(`Erro ao salvar item: ${error.message}`);
  }

  return data;
}

export default ItemFormModal;
