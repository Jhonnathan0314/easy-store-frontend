import { Role } from "./role.model";

export class User {
    id: number;
    username: string;
    name: string;
    lastName: string;
    role: Role;
}