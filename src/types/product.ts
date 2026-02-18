export interface Product {
    id: string;
    name: string;
    price: string;
    priceAmount: number;
    reference: string;
    overview: string;
    category: string;
    url: string;
    image: string;
    domain: string;
    websiteId: string;
    scrapedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    websiteId?: string;
}
