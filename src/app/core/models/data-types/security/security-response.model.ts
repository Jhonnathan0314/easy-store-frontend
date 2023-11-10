export class ErrorMessage {
    code: number;
    title: string;
    detail: string;
}

export class ApiResponse<T> {
    data: T;
    error: ErrorMessage;
}

export class AuthResponse {
    token: string;
}