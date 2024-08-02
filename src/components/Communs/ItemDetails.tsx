// ItemDetails.tsx

import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useItemDetails } from "@/stores/detailStore";

export default function ItemDetails() {
    const { id } = useParams<{ id: string }>();
    const {
        item,
        mainImage,
        newLocation,
        movements,
        origin,
        destination,
        movementQuantity,
        updateLocation,
        handleMovementSubmit,
        handleDeleteItem,
        handleImageClick,
        handleLocationChange,
        setOrigin,
        setDestination,
        setMovementQuantity,
    } = useItemDetails(id);

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
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Localização:</span>
                            <input
                                type="text"
                                value={newLocation}
                                onChange={handleLocationChange}
                                placeholder="Digite a nova localização"
                                className="border rounded px-2 py-1 ml-2"
                            />
                            <Button
                                variant="default"
                                onClick={updateLocation}
                            >
                                Atualizar Localização
                            </Button>
                        </div>
                    </div>
                </div>
                <Separator />
                <div className="grid gap-4 text-sm leading-loose">
                    <h2 className="font-semibold text-lg">Rastreamento de Itens</h2>
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Localização Atual:</span>
                            <span className="font-bold underline">{item.location}</span>
                        </div>
                    </div>
                </div>
                <Separator />
                <div className="grid gap-4 text-sm leading-loose">
                    <h2 className="font-semibold text-lg">Registro de Movimentações</h2>
                    <form onSubmit={handleMovementSubmit} className="grid gap-2">
                        <input
                            type="text"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            placeholder="Origem"
                            className="border rounded px-2 py-1"
                        />
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="Destino"
                            className="border rounded px-2 py-1"
                        />
                        <input
                            type="number"
                            value={movementQuantity}
                            onChange={(e) => setMovementQuantity(Number(e.target.value))}
                            placeholder="Quantidade"
                            className="border rounded px-2 py-1"
                        />
                        <Button
                            variant="default"
                            type="submit"
                        >
                            Registrar Movimentação
                        </Button>
                    </form>
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
                            {movements.map((movement) => (
                                <TableRow key={movement.id}>
                                    <TableCell>{new Date(movement.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{movement.origin}</TableCell>
                                    <TableCell>{movement.destination}</TableCell>
                                    <TableCell>{movement.quantity}</TableCell>
                                </TableRow>
                            ))}
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
                        width={600}
                        height={600}
                        className="aspect-square object-cover border w-full rounded-lg overflow-hidden"
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
