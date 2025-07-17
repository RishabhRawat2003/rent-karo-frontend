import { jwtDecode } from "jwt-decode";

export interface MyTokenPayload {
    id: string;
    email: string;
    iat: number;
    role: string;
}

export function decodeToken(token: string) : MyTokenPayload {
    return jwtDecode<MyTokenPayload>(token);
}