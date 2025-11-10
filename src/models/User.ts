import { Schema, model } from 'mongoose';
import argon2 from 'argon2';
import { IUserDocument } from '../types';

const ARGON2_SECRET = process.env.ARGON2_SECRET;
if (!ARGON2_SECRET) {
  throw new Error('ARGON2_SECRET environment variable must be defined');
}
const ARGON2_SECRET_BUFFER = Buffer.from(ARGON2_SECRET);

const userSchema: Schema<IUserDocument> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  isVerified: { type: Boolean, default: false },
  confirmationToken: { type: String, default: null, select: false }, 
  confirmationTokenExpires: { type: Date, default: null, select: false },
}, { timestamps: true });

const HASH_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 4,
  parallelism: 2,
  secret: ARGON2_SECRET_BUFFER,
};

// Hook pour hasher le mot de passe avant de sauvegarder
userSchema.pre('save', async function(next) {
  // Si le mot de passe est modifié, le hasher
  if (this.isModified('password')) {
    this.password = await argon2.hash(this.password as string, HASH_OPTIONS);
  }
  next();
});

userSchema.methods.checkPassword = async function(candidatePassword: string): Promise<boolean> {
  const user = this as IUserDocument;
  return argon2.verify(user.password as string, candidatePassword, {
    secret: ARGON2_SECRET_BUFFER,
  });
};

const User = model<IUserDocument>('User', userSchema);

export default User;