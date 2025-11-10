import { Document, Types } from 'mongoose';

export interface IUserDocument extends Document {
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    _id: Types.ObjectId;
    confirmationToken?: string | null;
    confirmationTokenExpires?: Date | null;
    checkPassword: (candidatePassword: string) => Promise<boolean>;
}

// L'interface utilisée pour les réponses API
export interface IUserDataResponse {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
}

export interface ILogoutResponse {
    message: string;
}


