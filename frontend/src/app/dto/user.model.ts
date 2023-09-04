import { JwtPayload } from "jwt-decode";

export interface User {
  email: string,
  password: string
  resume?: File,
  profile_picture?: File,
  first_name?: string,
  last_name?: string
  token?: JwtPayload; 
}