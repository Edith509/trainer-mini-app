import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWorkout extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  plan: any;
  isActive: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WorkoutSchema = new Schema<IWorkout>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    title: { type: String, required: true },

    description: { type: String },

    plan: { type: Schema.Types.Mixed, required: true },

    isActive: { type: Boolean, default: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export const Workout = mongoose.model<IWorkout>("Workout", WorkoutSchema);
