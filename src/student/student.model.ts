import { Schema, model } from "mongoose";

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
  },
  phone_number: Number,
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
