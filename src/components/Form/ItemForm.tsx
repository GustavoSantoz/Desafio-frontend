import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormData {
  name: string;
  description: string;
  quantity: number;
  category: string;
  location: string;
}

interface ItemFormProps {
  errors: FieldErrors<FormData>;
  register: UseFormRegister<FormData>;
}

const ItemForm = ({ errors, register }: ItemFormProps) => {
  return (
    <>
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
        <Label htmlFor="location">Localização</Label>
        <Input
          id="location"
          {...register("location")}
        />
        {errors.location && <p>{errors.location.message}</p>}
      </div>
    </>
  );
};

export default ItemForm;
