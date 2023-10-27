import { Schema, model } from "mongoose";
import validator from "validator";

//creating interface for student
export interface I_Student {
  name: string;
  phone_number: number;
  department: string;
  batch: number;
  current_sem: number;
}

export const StudentSchema = new Schema<I_Student>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone_number: {
    type: Number,
    validate(value: number) {
      if (!validator.isMobilePhone(value.toString())) {
        throw new Error("Phone number is invalid");
      }
    },
  },
  department: {
    type: String,
    required: true,
  },
  batch: {
    type: Number,
    required: true,
  },
  current_sem: {
    type: Number,
    required: true,
  },
});

export const StudentModel = model<I_Student>(
  "Student",
  StudentSchema,
  "students",
);
