import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "@/Supabase/supabaseClient";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export interface Item {
    id: number;
    name: string;
    description: string;
    quantity: number;
    category: string;
    images: string[];
}

export default function ItemDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [item, setItem] = useState<Item | null>(null);
    const [mainImage, setMainImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchItem = async () => {
            if (id) {
                const { data, error } = await supabase
                    .from("items")
                    .select("*")
                    .eq("id", id)
                    .single(); 
                if (error) {
                    console.error("Erro ao buscar item:", error.message);
                    return;
                }

                setItem(data);
                if (data?.images.length) {
                    setMainImage(data.images[0]);
                }
            }
        };

        fetchItem();
    }, [id]);

    const handleDeleteItem = async () => {
        try {
            if (item?.images && item.images.length > 0) {
                const { error: deleteImagesError } = await supabase.storage
                    .from("items")
                    .remove(item.images);

                if (deleteImagesError) {
                    throw new Error(`Erro ao excluir imagens: ${deleteImagesError.message}`);
                }
            }

            const { error: deleteItemError } = await supabase
                .from("items")
                .delete()
                .eq("id", id);

            if (deleteItemError) {
                throw new Error(`Erro ao excluir o item: ${deleteItemError.message}`);
            }

            navigate("/inventory"); 
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Erro ao excluir o item: ${error.message}`);
            } else {
                console.error("Erro desconhecido ao excluir o item");
            }
        }
    };

    const handleImageClick = (image: string) => {
        setMainImage(image);
    };

    if (!item) return <p>Carregando...</p>;

    return (
        <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6">
            <div className="grid gap-4 md:gap-10 items-start">
                <div className="grid gap-4">
                    <h1 className="font-bold text-3xl">{item.name}</h1>
                    <div>
                        <p>{item.description}</p>
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Estoque:</span>
                            <span>{item.quantity} unidades</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Categoria:</span>
                            <span>{item.category}</span>
                        </div>
                    </div>
                </div>
                <Separator />
                <div className="grid gap-4 text-sm leading-loose">
                    <h2 className="font-semibold text-lg">Rastreamento de Itens</h2>
                </div>
                <Separator />
                <div className="grid gap-4 text-sm leading-loose">
                    <h2 className="font-semibold text-lg">Registro de Movimentações</h2>
                </div>
                <Separator />
                <div className="grid gap-4 text-sm leading-loose">
                    <h2 className="font-semibold text-lg">Histórico de Movimentações</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Data</TableHead>
                                <TableHead>Origem</TableHead>
                                <TableHead>Destino</TableHead>
                                <TableHead>Quantidade</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        </TableBody>
                    </Table>
                </div>
                <Button
                    variant="destructive"
                    className="mt-4"
                    onClick={handleDeleteItem}
                >
                    Excluir Item
                </Button>
            </div>
            <div className="grid gap-3 items-start">
                <div className="grid gap-4">
                    <img
                        src={mainImage || "/placeholder.svg"}
                        alt="Imagem do Item"
                        width={400}
                        height={400}
                        className="aspect-square object-contain border w-full rounded-lg overflow-hidden"
                    />
                    <div className="hidden md:flex gap-4 items-start">
                        {item.images && item.images.map((image, index) => (
                            <button
                                key={index}
                                className="border hover:border-primary rounded-lg overflow-hidden transition-colors"
                                onClick={() => handleImageClick(image)}
                            >
                                <img
                                    src={image}
                                    alt={`Imagem de Visualização ${index + 1}`}
                                    width={100}
                                    height={100}
                                    className="aspect-square object-cover"
                                />
                                <span className="sr-only">Ver Imagem {index + 1}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
