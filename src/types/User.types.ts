import { Document } from "mongoose";
import type{UserRole} from "./authRequest";

export interface IUser extends Document {
   fullName: string;
     email: string;
     password: string;
     role: UserRole;
     isAvailable?: boolean; 
     isAccountDeleted?:boolean;
     passwordChangedAt?:Date;
}