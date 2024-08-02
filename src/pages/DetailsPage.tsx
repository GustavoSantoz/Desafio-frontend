import { useParams, useNavigate } from "react-router-dom";
import ItemDetails from "@/components/Communs/ItemDetails";
import { Button } from "@/components/ui/button";

export default function DetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    return (
        <div className="p-4">
            <div className="flex w-full justify-between">
                <h1 className="text-2xl font-bold mb-4">Detalhes do Item</h1>
                <Button
                    className="mb-4"
                    onClick={() => navigate('/inventory')}
                >
                    Voltar para a lista de itens
                </Button>
            </div>
            {id ? <ItemDetails /> : <p>ID do item não encontrado.</p>}
        </div>
    );
}
