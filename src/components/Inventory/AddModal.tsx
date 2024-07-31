import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-toastify";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import ItemForm from "./ItemForm";
import ImageUploader from "./ImageUploader";
import { uploadImages } from "@/utils/uploadsImages";
import { saveItem } from "@/utils/saveItem";
import { Button } from "@/components/ui/button";

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
          <ItemForm errors={errors} register={register} />
          <ImageUploader onFilesSelected={setSelectedFiles} />
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

export default ItemFormModal;
