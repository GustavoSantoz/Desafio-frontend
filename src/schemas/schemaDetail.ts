export interface Item {
    id: number;
    name: string;
    description: string;
    quantity: number;
    category: string;
    images: string[];
    location: string;
}

export interface Movement {
    id?: number;
    itemId: number;
    date: string;
    origin: string;
    destination: string;
    quantity: number;
}
