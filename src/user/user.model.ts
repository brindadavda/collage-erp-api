/* eslint-disable */
import { model, Schema, Document, Model } from "mongoose";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JwtRequest } from "../utils/auth";
import validator from "validator";

export interface I_User extends Document {
  name?: string;
  email: string;
  password: string;
  role: "ADMIN" | "STAFF" | "STUDENT";
  tokens?: token[];
}

type token = {
  token: string;
};

// Put all user instance methods in this interface:
interface I_User_Methods {
  generateAuthToken(): string;
  toJSON(): object;
}

// Create a new Model type that knows about IUserMethods...
interface I_User_Static_Methods extends Model<I_User, I_User_Methods> {
  findUser(
    email: string,
    role: JwtRequest,
    password: string,
  ): Promise<I_User & I_User_Methods>;
}

export const UserSchema: Schema = new Schema<I_User, I_User_Static_Methods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
  },
  email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      validate(value : string) {
          if (!validator.isEmail(value)) {
              throw new Error('Email is invalid');
          }
      }
  },
  password: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 7,
      validate(value : string) {
          if (value.toLowerCase().includes('password')) {
              throw new Error('password can not contain password');
          }
      }
  },
    role: {
      type: String,
      require: true,
      uppercase: true,
    },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

//adding password hasing
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }

  next();
});

//finding user by email , role , password
UserSchema.statics.findUser = async function (email, role, password) {
  const user = await UserModel.findOne({ email, role });

  if (!user) {
    return "User Not found";
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return "Password dos not workable";
  }

  return user;
};

// Generate a JWT token for the user
UserSchema.methods.generateAuthToken = async function (): Promise<string> {
  const user = this as I_User; // Cast to User type
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET || "secret",
  ); // Replace 'your-secret-key' with your actual secret key

  user.tokens = user.tokens || [];

  return token;
};

//we don't share the password and token
UserSchema.methods.toJSON = function () {
  const UserObject = this.toObject();

  delete UserObject.password;
  delete UserObject.tokens;

  return UserObject;
};

export const UserModel = model<I_User, I_User_Static_Methods>(
  "User",
  UserSchema,
  "user",
);
