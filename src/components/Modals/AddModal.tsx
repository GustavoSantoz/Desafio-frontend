import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import ItemForm from "../Form/ItemForm";
import ImageUploader from "../Input/UploadInput";
import { useAddStore } from "@/stores/addStore";
import { schemaAdd, ItemFormDataAdd } from "@/schemas/schemaAdd";
import { Button } from "@/components/ui/button";

const ItemFormModal = ({ onItemAdded }: { onItemAdded: () => void }) => {
  const { addItem } = useAddStore();

  const { register, handleSubmit, formState: { errors } } = useForm<ItemFormDataAdd>({
    resolver: zodResolver(schemaAdd),
  });

  const onSubmit: SubmitHandler<ItemFormDataAdd> = async (data) => {
    try {
      await addItem({ ...data, images: [] });
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
          <ImageUploader onFilesSelected={() => { }} />
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
