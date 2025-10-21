export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    token: string;
    expirationToken: Date;
    isVerified: boolean;
}

export type RegisterBody = Pick<IUser, 'name' | 'email' | 'password'>;
