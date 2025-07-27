// export const BASE_URL = "https://eduplant-be.vercel.app/";
export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    LOGOUT: "/api/auth/logout",
  },

  USERS: {
    GET_ALL_USERS: "/api/users",
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`,
    CREATE_USER: "/api/users",
    UPDATE_USER_BY_ID: (userId) => `/api/users/${userId}`,
    DELETE_USER_BY_ID: (userId) => `/api/users/${userId}`,
  },

  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data",
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data",
    GET_ALL_TASKS: "/api/tasks",
    GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`,
    GET_TASK_BY_TYPE: (taskType) => `/api/tasks/type/${taskType}`,
    CREATE_TASK: "/api/tasks",
    UPDATE_TASK_BY_ID: (taskId, taskType) => `/api/tasks/${taskType}/${taskId}`,
    DELETE_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`,

    UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`,
    UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`,

    CREATE_TASK_BY_TYPE: (taskType) => `/api/tasks/${taskType}`,
    DELETE_QUESTION_BY_ID_TYPE: (taskId, questionType, questionId) => `/api/tasks/${taskId}/questions/${questionId}?type=${questionType}`,
    POST_SUBMISSION_BY_TASK_ID: (taskType, taskId) => `/api/task-submissions/${taskType}/${taskId}`,
    GET_SUBMISSION_BY_TASK_ID: (taskId) => `/api/task-submissions/task/${taskId}`,
    GET_SUBMISSION_BY_ID_USER: (taskType, userId) => `/api/task-submissions/${taskType}/user/${userId}`,
    POST_SUBMISSION_SCORE: (taskType, taskId, userId) => `/api/task-submissions/${taskType}/${taskId}/score/${userId}`,

    POST_SURVEY: "/api/survei",
    GET_SURVEY: "/api/survei",
    GET_SURVEY_BY_USER_ID: (userId) => `/api/survei/${userId}`,

    CREATE_TASK_MINDMAP: "/api/mindmap",
    GET_ALL_TASK_MINDMAP: "/api/mindmap",
    GET_TASK_MINDMAP_BY_ID: (taskId) => `/api/mindmap/${taskId}`,
    GET_SUBMISSION_MINDMAP_BY_TASK_ID: (taskId) => `/api/mindmap/${taskId}/submissions`,
    GET_SUBMISSION_MINDMAP_BY_ID_USER: (taskId) => `/api/mindmap/${taskId}/mysubmission`,
    UPDATE_TASK_MINDMAP_BY_ID: (taskId) => `/api/mindmap/${taskId}`,
    DELETE_TASK_MINDMAP_BY_ID: (taskId) => `/api/mindmap/${taskId}`,
    POST_SUBMISSION_MINDMAP_BY_TASK_ID: (taskMindmapId) => `/api/mindmap/${taskMindmapId}/submit`,
    GET_ALL_SUBMISSION_MINDMAP: "/api/mindmap/submissions",
    GET_SUBMISSION_MINDMAP_ADMIN_BY_ID_USER: (userId) => `/api/mindmap/submissions/${userId}`,
    UPDATE_MINDMAP_SCORE: (submissionId) => `/api/mindmap/${submissionId}/score`,
    UPDATE_MINDMAP_STATUS: (taskId) => `/api/mindmap/${taskId}/status`,

    CREATE_MATERIALS: "/api/materials",
    GET_MATERIALS: "/api/materials",
    GET_MATERIALS_BY_TYPE: (materialType) => `/api/materials/${materialType}`,
    UPDATE_MATERIALS_BY_ID: (materialId) => `/api/materials/${materialId}`,
    DELETE_MATERIALS_BY_ID: (materialId) => `/api/materials/${materialId}`,
    UPDATE_MATERIALS_STATUS: (materialId) => `/api/materials/${materialId}/status`,
    DELETE_MATERIALS_FILE_BY_ID: (materialId, fileName) => `/api/materials/${materialId}/files/${fileName}`,
  },

  REPORTS: {
    EXPORT_TASK: "/api/reports/export/tasks",
    EXPORT_USERS: "/api/reports/export/users",
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },

  GROUPS: {
    GET_GROUP_BY_PROBLEM_ID: (taskId, problemId) => `/api/tasks/${taskId}/problem/${problemId}/group`,
    GET_MESSAGES_BY_GROUP_ID: (groupId) => `/api/groups/${groupId}/messages`,
    POST_MESSAGE_TO_GROUP: (groupId) => `/api/groups/${groupId}/messages`,
  },
};
