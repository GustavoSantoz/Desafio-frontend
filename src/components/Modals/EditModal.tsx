import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Campo from "../Communs/Campo";
import { useInventoryStore } from "@/stores/inventoryStore";
import { useEffect } from "react";
import { editItemSchema, EditItemFormData } from "@/schemas/schemaEdit";

const EditModal = () => {
  const { selectedItem, isEditModalOpen, setIsEditModalOpen, handleSaveItem } = useInventoryStore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<EditItemFormData>({
    resolver: zodResolver(editItemSchema),
    defaultValues: selectedItem || {
      id: 0,
      name: "",
      description: "",
      quantity: 1,
      category: "",
      location: "",
    },
  });

  useEffect(() => {
    if (selectedItem) {
      reset(selectedItem);
    }
  }, [selectedItem, reset]);

  const onSubmit: SubmitHandler<EditItemFormData> = async (data) => {
    await handleSaveItem(data);
    setIsEditModalOpen(false);
  };

  return (
    <Dialog open={isEditModalOpen} onOpenChange={() => setIsEditModalOpen(false)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Campo label="Nome" htmlFor="name">
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </Campo>
          <Campo label="Descrição" htmlFor="description">
            <Input id="description" {...register("description")} />
            {errors.description && <p className="text-red-500">{errors.description.message}</p>}
          </Campo>
          <Campo label="Quantidade" htmlFor="quantity">
            <Input type="number" id="quantity" {...register("quantity", { valueAsNumber: true })} />
            {errors.quantity && <p className="text-red-500">{errors.quantity.message}</p>}
          </Campo>
          <Campo label="Categoria" htmlFor="category">
            <Input id="category" {...register("category")} />
            {errors.category && <p className="text-red-500">{errors.category.message}</p>}
          </Campo>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
