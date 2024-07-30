import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { uploadImages } from "@/utils/uploadsImages.tsx"; // Ajuste o caminho conforme necessário
import saveItem from "@/utils/Save";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  quantity: z.number().min(1, "Quantidade deve ser pelo menos 1").nonnegative(),
  category: z.string().min(1, "Categoria é obrigatória"),
  images: z.array(z.instanceof(File)).max(4, "Máximo de 4 imagens"),
});

export type FormData = z.infer<typeof schema>;

const ItemForm: React.FC = () => {
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
      if (!selectedFiles || selectedFiles.length === 0) {
        throw new Error("No files selected");
      }

      const imageUrls = await uploadImages(selectedFiles);
      if (!imageUrls || imageUrls.length === 0) {
        throw new Error("Failed to upload images");
      }

      await saveItem(data, imageUrls);
      toast.success("Item cadastrado com sucesso!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Erro ao cadastrar o item: ${error.message}`);
      } else {
        toast.error("Erro ao cadastrar o item");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Cadastro de Item</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
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
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          {errors.images && (
            <p className="text-red-500">{errors.images.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full">
          Cadastrar
        </Button>
      </form>
    </div>
  );
};

export default ItemForm;
