/* eslint-disable */
import mongoose, { Schema, Document, model } from "mongoose";

export interface I_Attendance extends Document {
  year: number;
  branches: branche[];
  attendance: attend[];
}

export type branche = {
  name: string;
  totalStudentsIntake: number;
};

type attend = {
  date: Date;
  student: student[];
};

export type student = {
  studentId: Object;
  isPresent: false;
};

export const attendanceSchema = new Schema<I_Attendance>({
  year: {
    type: Number,
    require: true,
    unique: true,
    ref: "Student",
  },
  branches: [
    {
      name: {
        type: String,
      },
      totalStudentsIntake: {
        type: Number,
      },
    },
  ],
  attendance: [
    {
      date: Date,
      student: [
        {
          studentId: {
            type: mongoose.Types.ObjectId,
            ref: "Student",
          },
          isPresent: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  ],
});

export const attendanceModel = model<I_Attendance>(
  "Attendance",
  attendanceSchema,
  "attendance",
);
