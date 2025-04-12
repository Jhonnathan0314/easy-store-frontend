import { Category } from "./category.model";

export class Subcategory {
    id: number;
    name: string;
    categoryId: number;
    category?: Category;
}