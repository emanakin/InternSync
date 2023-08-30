export interface AuthToken {
    email: string;
    exp: number;
    iat: number;
    userId: string;
}