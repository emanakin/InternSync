export interface AuthToken {
    email: string;
    exp: number;
    iat: number;
    userId: string;
    first_name: string;
    last_name: string;
    imgUrl: string
}