import mongoose from "mongoose";
import User from "./user.model.js";

const quizSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (options) => options.length === 4,
        message: "Exactly 4 options are required",
      },
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
