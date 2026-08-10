import express from "express";
import {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getCurrentQuiz,
  getAllQuizzes,
} from "../controller/quiz.controller.js";
import authenticate from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply authenticate middleware to all quiz routes
router.use(authenticate);

router.route("/")
  .post(createQuiz)
  .get(getAllQuizzes);

router.route("/:id")
  .get(getCurrentQuiz)
  .put(updateQuiz)
  .delete(deleteQuiz);

export default router;