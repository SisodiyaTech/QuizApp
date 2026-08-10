import Quiz from "../model/quiz.model.js";

const isQuizOwner = (quiz, userId) => {
  return quiz.userId.toString() === userId.toString();
};

export const createQuiz = async (req, res) => {
  try {
    const { question, options, answer } = req.body;

    if (!question || !options || !answer) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newQuiz = await Quiz.create({
      userId: req.user._id,
      question,
      options,
      answer,
    });

    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ message: "Error creating quiz", error });
  }
};


export const updateQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, options, answer } = req.body;

        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        if (!isQuizOwner(quiz, req.user._id)) {
            return res.status(403).json({ message: "Not authorized to update this quiz" });
        }

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            id,
            { question, options, answer },
            { new: true }
        );

        return res.status(200).json({
            message: "Quiz Updated",
            quiz: updatedQuiz
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;

        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        if (!isQuizOwner(quiz, req.user._id)) {
            return res.status(403).json({ message: "Not authorized to delete this quiz" });
        }

        await Quiz.findByIdAndDelete(id);

        return res.status(200).json({ message: "Quiz deleted" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



export const getCurrentQuiz = async (req, res) => {
    try {
        const { id } = req.params;

        const quiz = await Quiz.findById(id);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        if (!isQuizOwner(quiz, req.user._id)) {
            return res.status(403).json({ message: "Not authorized to access this quiz" });
        }

        return res.status(200).json({
            message: "Quiz fetched successfully",
            quiz
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ userId: req.user._id });

        return res.status(200).json({
            count: quizzes.length,
            quizzes
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};