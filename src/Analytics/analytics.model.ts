import { Schema, Document, model } from "mongoose";

export interface I_Analytics extends Document {
  year: number;
  branches: branche[];
}

type branche = {
  name: string;
  totalStudentsIntake: number;
};

export const AnalyticsSchema = new Schema<I_Analytics>({
  year: {
    type: Number,
    require: true,
  },
  branches: {
    branche: {
      name: {
        type: String,
      },
      totalStudentsIntake: {
        type: Number,
      },
    },
  },
});

export const analyticsModel = model<I_Analytics>(
  "Analytics",
  AnalyticsSchema,
  "batches",
);
