export class StoreRequest {
    id: number;
    userId: number;
    username: string;
    storeName: string;
    storeDescription: string;
    status: string;
    reviewedBy: number | null;
    creationDate: string;
    updateDate: string;
}

export class StoreRequestRq {
    storeName: string;
    storeDescription: string;
}
