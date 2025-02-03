export class SessionData {
    token: string;
    username: string;
    role: string;
    userId: number;
    accountId: number;

    isValid(): boolean {
        return this.token != null && this.token != undefined && this.token != "" &&
            this.username != null && this.username != undefined && this.username != "" &&
            this.role != null && this.role != undefined && this.role != "" &&
            this.userId != null && this.userId != undefined &&
            this.accountId != null && this.accountId != undefined;
    }
}