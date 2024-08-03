import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import ItemForm from "../Form/ItemForm";
import ImageUploader from "../Input/UploadInput";
import { uploadImages } from "@/utils/uploadsImages";
import { saveItem } from "@/utils/saveItem";
import { Button } from "@/components/ui/button";
import { schema, FormData } from "@/schemas/schemaAdd";

const ItemFormModal = ({ onItemAdded }: { onItemAdded: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
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
      await saveItem({ ...data, images: imageUrls, location: data.location });
      toast.success("Item cadastrado com sucesso!");
      onItemAdded();
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro ao cadastrar o item");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>Adicionar Novo Item</Button>
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
              <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
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
