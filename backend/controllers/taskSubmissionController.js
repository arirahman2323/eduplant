const Task = require("../models/Task");
const TaskSubmission = require("../models/TaskSubmission");

// @desc    Submit task answer (for pretest or postest)
// @route   POST /api/task-submissions/:type/:taskId
// @access  Private (Member)
const submitTaskAnswer = async (req, res) => {
  try {
    const { type, taskId } = req.params;
    let {
      essayAnswers = [],
      multipleChoiceAnswers = [],
      problemAnswer = [], // <- Tambahan baru
    } = req.body;

    const userId = req.user._id;

    if (type !== "pretest" && type !== "postest" && type !== "problem" && type !== "refleksi" && type !== "lo" && type !== "kbk") {
      return res.status(400).json({ message: "Type must be 'pretest', 'postest', 'problem', 'refleksi, 'lo', or 'kbk'" });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (type === "pretest" && !task.isPretest) {
      return res.status(400).json({ message: "This task is not marked as a pretest" });
    }
    if (type === "postest" && !task.isPostest) {
      return res.status(400).json({ message: "This task is not marked as a postest" });
    }
    if (type === "problem" && !task.isProblem) {
      return res.status(400).json({ message: "This task is not marked as a problem" });
    }
    if (type === "refleksi" && !task.isRefleksi) {
      return res.status(400).json({ message: "This task is not marked as a problem" });
    }
    if (type === "lo" && !task.isLo) {
      return res.status(400).json({ message: "This task is not marked as a LO" });
    }
    if (type === "kbk" && !task.isKbk) {
      return res.status(400).json({ message: "This task is not marked as a KBK" });
    }

    // const alreadySubmitted = await TaskSubmission.findOne({ task: taskId, user: userId });
    // if (alreadySubmitted) {
    //   return res.status(400).json({ message: "You have already submitted this task" });
    // }
    
    // Ambil file PDF dari req.files
    const pdfFiles = req.files?.map(file =>
      `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
    ) || [];

    // Handle problem answers
    if (type === "problem") {
      problemAnswer = problemAnswer.map((ans) => {
        const matchedProblem = task.problem.find((p) => p._id.toString() === ans.questionId);
        if (!matchedProblem) {
          throw new Error("Invalid problem ID");
        }
        return {
          questionId: ans.questionId,
          problem: ans.problem,
          groupId: matchedProblem.groupId,
        };
      });
    }

    const submission = await TaskSubmission.create({
      task: taskId,
      user: userId,
      essayAnswers,
      multipleChoiceAnswers,
      problemAnswer, // <- Disimpan
      pdfFiles, // <- Disimpan
    });

    res.status(201).json({ message: "Task submitted successfully", submission });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all task submissions by user ID and task type
// @route   GET /api/task-submissions/:type/user/:userId
// @access  Private (Admin or user himself)
const getSubmissionsByUser = async (req, res) => {
  try {
    const { userId, type } = req.params;

    // Validasi tipe
    const validTypes = ["pretest", "postest", "problem", "refleksi", "lo", "kbk"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Type must be 'pretest', 'postest', 'problem', 'refleksi, 'lo', or 'kbk'" });
    }

    const submissions = await TaskSubmission.find({ user: userId }).populate("task", "title isPretest isPostest isProblem isRefleksi isLo isKbk dueDate").lean();

    // Filter berdasarkan tipe
    const filtered = submissions.filter((sub) => {
      if (type === "pretest") return sub.task?.isPretest;
      if (type === "postest") return sub.task?.isPostest;
      if (type === "problem") return sub.task?.isProblem;
      if (type === "refleksi") return sub.task?.isRefleksi;
      if (type === "lo") return sub.task?.isLo;
      if (type === "kbk") return sub.task?.isKbk;
    });

    res.json({
      userId,
      type,
      totalTasks: filtered.length,
      submissions: filtered,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all task submissions (Admin only)
// @route   GET /api/task-submissions
// @access  Private (Admin)
const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await TaskSubmission.find().populate("task", "title isPretest isPostest isProblem isRefleksi isLO isKBK dueDate").populate("user", "name email role").lean();

    res.json({
      totalSubmissions: submissions.length,
      submissions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get submissions by task ID (Admin only)
// @route   GET /api/task-submissions/task/:taskId
// @access  Private (Admin)
const getSubmissionsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const submissions = await TaskSubmission.find({ task: taskId }).populate("task", "title isPretest isPostest isProblem isRefleksi isLo isKbk dueDate").populate("user", "name email role");

    res.json({
      taskId,
      totalSubmissions: submissions.length,
      submissions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update essay scores by submission ID
// @route   POST /api/task-submissions/score-essay/:submissionId
// @access  Private (Admin)

// @desc    Update essay scores by user and type
// @route   POST /api/task-submissions/score-essay/:type/:userId
// @access  Private (Admin)
const updateEssayScoresByUserType = async (req, res) => {
  try {
    const { type, userId } = req.params;
    const { scores = [] } = req.body;

    // Validasi tipe
    if (type !== "pretest" && type !== "postest" && type !== "refleksi") {
      return res.status(400).json({ message: "Type must be 'pretest', 'postest', or 'refleksi'" });
    }

    // Ambil semua submission milik user
    const submissions = await TaskSubmission.find({ user: userId }).populate("task");

    // Filter submission berdasarkan jenis tugas
    const targetSubmissions = submissions.filter((sub) => {
      if (type === "pretest") return sub.task?.isPretest;
      if (type === "postest") return sub.task?.isPostest;
      if (type === "refleksi") return sub.task?.isRefleksi;
      return false;
    });

    let totalUpdated = 0;

    for (const submission of targetSubmissions) {
      let updated = false;

      submission.essayAnswers = submission.essayAnswers.map((answer) => {
        const answerQid = answer.questionId?.toString();
        const found = scores.find((s) => s.questionId?.toString() === answerQid);

        if (found) {
          updated = true;
          totalUpdated++;
          return {
            questionId: answer.questionId,
            answer: answer.answer,
            score: found.score,
          };
        }

        return answer;
      });

      if (updated) {
        submission.markModified("essayAnswers");

        // Tambahkan logika menghitung total skor essay
        submission.score = submission.essayAnswers.reduce((total, ans) => total + (ans.score || 0), 0);

        await submission.save();
        console.log(`✅ Skor diperbarui: Submission ${submission._id}, total score: ${submission.score}`);
      }
    }

    res.json({
      message: `✅ Updated ${totalUpdated} essay score(s) for user ${userId} and type '${type}'`,
    });
  } catch (error) {
    console.error("❌ Error updating essay scores:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Update total score of a submission (with explanation for LO/KBK)
// @route POST /api/task-submissions/:type/:taskId/score/:userId
// @access Private (Admin)
const updateTotalScore = async (req, res) => {
  try {
    const { type, taskId, userId } = req.params;

    let { score, explanation } = req.body || {};
    score = Number(score);

    const validTypes = ["pretest", "postest", "problem", "refleksi", "lo", "kbk"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Type must be one of: pretest, postest, problem, refleksi, lo, kbk" });
    }

    if (isNaN(score)) {
      return res.status(400).json({ message: "Score must be a valid number" });
    }

    // 🔑 Cari submission terbaru berdasarkan user + task
    const submissionToUpdate = await TaskSubmission.findOne({ user: userId, task: taskId })
      .sort({ updatedAt: -1 }) // ambil yang paling terakhir dikirim
      .populate("task");

    if (!submissionToUpdate) {
      return res.status(404).json({
        message: "Submission not found for given user, task, and type",
      });
    }

    // Validasi tipe task
    if (type === "pretest" && !submissionToUpdate.task?.isPretest) return res.status(400).json({ message: "This task is not marked as a pretest" });
    if (type === "postest" && !submissionToUpdate.task?.isPostest) return res.status(400).json({ message: "This task is not marked as a postest" });
    if (type === "problem" && !submissionToUpdate.task?.isProblem) return res.status(400).json({ message: "This task is not marked as a problem" });
    if (type === "refleksi" && !submissionToUpdate.task?.isRefleksi) return res.status(400).json({ message: "This task is not marked as a refleksi" });
    if (type === "lo" && !submissionToUpdate.task?.isLo) return res.status(400).json({ message: "This task is not marked as a LO" });
    if (type === "kbk" && !submissionToUpdate.task?.isKbk) return res.status(400).json({ message: "This task is not marked as a KBK" });

    // Update nilai
    submissionToUpdate.score = score;

    // Untuk LO / KBK, simpan explanation dan file
    if (["lo", "kbk"].includes(type)) {
      submissionToUpdate.explanation = explanation || "";
      if (req.file) {
        submissionToUpdate.feedbackFile = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      }
    }

    submissionToUpdate.task.status = "Completed"; // optional
    await submissionToUpdate.save();

    res.json({
      message: "✅ Score and feedback updated successfully",
      updatedSubmission: submissionToUpdate,
    });
  } catch (error) {
    console.error("❌ Error updating total score:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  submitTaskAnswer,
  getSubmissionsByUser,
  getAllSubmissions,
  updateEssayScoresByUserType,
  getSubmissionsByTask,
  updateTotalScore,
};
