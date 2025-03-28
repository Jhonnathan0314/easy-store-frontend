import { Role } from "./role.model";

export class LoginRequest {
    username: string;
    password: string;
    accountId?: number;
}

export class RegisterRequest {
    name: string;
    lastName: string;
    username: string;
    password: string;
    role: Role;
}

export class ResetPasswordRequest {
    username: string;
    password: string;
    confirmPassword: string;
    code: number;
}