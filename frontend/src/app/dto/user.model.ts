import { JwtPayload } from "jwt-decode";

export interface User {
  email: string,
  password: string,
}

export interface AuthenticatedUser extends User {
  token: JwtPayload; 
}