import mongoose, { Schema, Document, Model } from "mongoose";

// Define TypeScript interfaces for the schema
interface IMeta {
  quiz_name?: string;
  invitation_code?: string;
  question_set?: {
    question: string;
    options: string[];
    correct_option: string;
  }[];
  community_id?: string;
  start_time?: number;
  end_time?: number;
  description?: string;
  active?: boolean;
  _id?: boolean;
}

interface IQuiz extends Document {
  meta: IMeta;
  participants: mongoose.Schema.Types.Mixed;
  start_time: number;
  end_time: number;
}

// Define the Meta Schema
const metaSchema = new Schema<IMeta>({
  quiz_name: {
    type: String,
    required: true,
  },
  invitation_code: {
    type: String,
    required: true,
  },
  question_set: {
    type: [
      {
        question: { type: String, required: true },
        options: { type: [String], required: true },
        correct_option: { type: String, required: true },
      },
    ],
    required: true,
  },
  community_id: {
    type: String,
    required: true,
  },
  start_time: {
    type: Number,
    required: true,
  },
  end_time: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  active: {
    type: Boolean,
    default: true,
  },
  _id: false,
});

// Define the Quiz Schema
const quizSchema = new Schema<IQuiz>(
  {
    meta: {
      type: metaSchema,
      required: true,
    },
    participants: {
      type: Schema.Types.Mixed,
      default: [], // Array to store participant data
    },
    start_time: {
      type: Number,
      required: true,
    },
    end_time: {
      type: Number,
      required: true,
    },
  },
  { minimize: false }
);

// Create and export the Quiz Model
const quizModel: Model<IQuiz> = mongoose.model<IQuiz>("quizzes", quizSchema);

export { quizModel, IQuiz, IMeta };
