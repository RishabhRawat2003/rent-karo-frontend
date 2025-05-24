import { jwtDecode } from "jwt-decode";

export function decodeToken(token: string) {
    const decodedToken: any = jwtDecode(token);
    return decodedToken;
}