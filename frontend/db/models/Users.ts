import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//npm install --save-dev @types/bcryptjs @types/jsonwebtoken mongoose

export interface IUser extends Document {
  name: string;
  email: string;
  role: "user" | "shopowner" | "admin";
  status: "active" | "inactive";
  tel: string;
  password?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please add a valid email",
    ],
  },
  role: {
    type: String,
    enum: ["user", "shopowner", "admin"],
    default: "user",
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  tel: {
    type: String,
    required: [true, "Please add a telephone number"],
    match: [/^[0-9]{10}$/, "Telephone number must be exactly 10 digits"],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedJwtToken = function (): string {
  const secret = process.env.JWT_SECRET || "default_secret_for_dev_only";
  const expire = (process.env.JWT_EXPIRE as any) || "30d"; 

  return jwt.sign({ id: this._id }, secret, {
    expiresIn: expire,
  });
};

const User: Model<IUser> = mongoose.models.MS_Users || mongoose.model<IUser>("MS_Users", UserSchema);

export default User;
