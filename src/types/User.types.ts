import { Document } from "mongoose";
import type{UserRole} from "./authRequest.ts";

export interface IUser extends Document {
   fullName: string;
     email: string;
     password: string;
     role: UserRole;
     phoneNumber?:String;
     isAvailable?: boolean; 
     isAccountDeleted?:boolean;
     passwordChangedAt?:Date;
}