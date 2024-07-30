import React from "react";
import ItemForm from "@/components/Inventory/ItemForm";

const AddItemPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Adicionar Novo Item</h1>
      <ItemForm />
    </div>
  );
};

export default AddItemPage;
