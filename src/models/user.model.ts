import mongoose, { Schema, Document, Model } from 'mongoose';
import type{UserRole} from "../types/authRequest";

export interface IUser extends Document {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    role: UserRole;
    phoneNumber?:String;
    isAvailable?: boolean; 
    isAccountDeleted?:boolean;
    passwordChangedAt?:Date;
 
    }

const UserSchema =new Schema<IUser>({
    fullName:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
        select:false,
    },
    role:{
        type: String,
        enum: ["Facilitator", "Learner", "Admin"],
        required: true,
    },
    phoneNumber:{
        type: String,
        required: false,
        trim: true,
    },
    isAvailable:{
        type: Boolean,
        default: false,
    },
    isAccountDeleted:{
        type:Boolean,
        default:false,
    },
      passwordChangedAt: { 
        type: 
        Date
     },
 
},{timestamps:true});

const UserModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default UserModel;
