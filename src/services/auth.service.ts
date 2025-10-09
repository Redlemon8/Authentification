import { IUser } from '../interfaces/user.interface';
import User from '../models/User';

const authService = {
    register: async (user: IUser) => {
        const newUser = await User.create(user);
        return newUser;
    },

    findOne: async (query: any) => {
        return await User.findOne(query);
    }
}

export default authService;