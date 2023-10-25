/* eslint-disable */
import mongoose, { Schema, Document, model } from "mongoose";

export interface I_Analytics extends Document {
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
    student: student[]
}

export type student = {
    studentId: Object,
    isPresent: false
}

export const AnalyticsSchema = new Schema<I_Analytics>({
    year: {
        type: Number,
        require: true,
        unique: true,
        ref : 'Student'
    },
    branches: [{
        name: {
            type: String,
        },
        totalStudentsIntake: {
            type: Number,
        },
    }],
    attendance: [{
        date: Date,
        student: [{
            studentId: {
                type: mongoose.Types.ObjectId,
                ref: 'Student'
            },
            isPresent: {
                type: Boolean,
                default: false,
            }
        }]
    }]
});

export const attendanceModel = model<I_Analytics>(
    "Attendance",
    AnalyticsSchema,
    "attendance",
);
