import { Schema, model } from 'mongoose';
import argon2 from 'argon2';
import { IUserDocument } from '../types';

const userSchema: Schema<IUserDocument> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  isVerified: { type: Boolean, default: false },
  confirmationToken: { type: String, default: null, select: false }, 
  confirmationTokenExpires: { type: Date, default: null, select: false },
}, { timestamps: true });

// Hook pour hasher le mot de passe avant de sauvegarder
userSchema.pre('save', async function(next) {
  // Si le mot de passe est modifié, le hasher
  if (this.isModified('password')) {
    this.password = await argon2.hash(this.password as string);
  }
  next();
});

userSchema.methods.checkPassword = async function(candidatePassword: string): Promise<boolean> {
  const user = this as IUserDocument;
  return argon2.verify(user.password as string, candidatePassword);
};

const User = model<IUserDocument>('User', userSchema);

export default User;