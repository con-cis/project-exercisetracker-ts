import mongoose, { Schema, Document, Model } from "mongoose";

interface Exercise {
  description: string;
  duration: number;
  date?: Date;
}

interface ExerciseDocument extends Exercise, Document {}

type ExerciseModel = Model<ExerciseDocument>;

const exerciseSchema: Schema<ExerciseDocument> = new Schema<ExerciseDocument>({
  description: { type: String, required: [true, "Description is required"] },
  duration: { type: Number, required: [true, "Duration is required"] },
  date: { type: Date },
});

const Exercise: ExerciseModel = mongoose.model<ExerciseDocument, ExerciseModel>(
  "Exercise",
  exerciseSchema
);

export { Exercise, exerciseSchema };
