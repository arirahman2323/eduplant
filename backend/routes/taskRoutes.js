const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware"); // ← multer config kamu
const {
  getDashboardData,
  getUserDashboardData,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getTasksByType,
  updateTaskQuestionsOnly,
  deleteTaskQuestions,
  getFullTaskSubmissionsByUser,
  downloadEportfolioAsPdf,
} = require("../controllers/taskController");

const router = express.Router();

// Full submissions & e-portfolio
router.get("/full-submissions/:userId", protect, getFullTaskSubmissionsByUser);
router.get("/eportfolio/:userId/download", protect, downloadEportfolioAsPdf);

// Dashboard
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);

// Task fetching
router.get("/", protect, getTasks);
router.get("/:id", protect, getTaskById);

// Update task questions only
router.put("/pretest/:id", protect, upload.array("files"), updateTaskQuestionsOnly);
router.put("/postest/:id", protect, upload.array("files"), updateTaskQuestionsOnly);
router.put("/problem/:id", protect, upload.array("files"), updateTaskQuestionsOnly);
router.put("/refleksi/:id", protect, upload.array("files"), updateTaskQuestionsOnly);
router.put("/lo/:id", protect, upload.array("files"), updateTaskQuestionsOnly);
router.put("/kbk/:id", protect, upload.array("files"), updateTaskQuestionsOnly);

// Create task by type (pakai upload)
router.post("/pretest", protect, upload.array("files"), createTask);
router.post("/postest", protect, upload.array("files"), createTask);
router.post("/problem", protect, upload.array("files"), createTask);
router.post("/refleksi", protect, upload.array("files"), createTask);
router.post("/lo", protect, upload.array("files"), createTask);
router.post("/kbk", protect, upload.array("files"), createTask);

// Task modification
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, adminOnly, deleteTask);
router.put("/:id/status", protect, updateTaskStatus);
router.put("/:id/todo", protect, updateTaskChecklist);

// Filter task by type
router.get("/type/:type", protect, getTasksByType);

// Get chat group info for a specific problem
router.get("/:taskId/problem/:problemId/group", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const problemItem = task.problem.find((p) => p._id.toString() === req.params.problemId);
    if (!problemItem || !problemItem.groupId) {
      return res.status(404).json({ message: "Group for this problem not found" });
    }

    const group = await Group.findById(problemItem.groupId).populate("members", "name email profileImageUrl");
    if (!group) return res.status(404).json({ message: "Group not found" });

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete question from task
router.delete("/:taskId/questions/:questionId", protect, deleteTaskQuestions);

module.exports = router;
