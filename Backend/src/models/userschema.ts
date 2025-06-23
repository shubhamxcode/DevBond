import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  refreshToken?: string;
  selectedField?: string;
  getAccessToken: () => string;
  getreftoken: () => string;
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  selectedField: {
    type: String,
    required: false,
  },
  refreshToken: {
    type: String,
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  // Increase bcrypt rounds from 6 to 10 for better security
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.getAccessToken = function (this: IUser): string {
    return Jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
        }
    );
};

userSchema.methods.getreftoken = function (this: IUser): string {
    return Jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECREAT as string,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
        }
    );
};

export const User = mongoose.model<IUser>('User', userSchema);
