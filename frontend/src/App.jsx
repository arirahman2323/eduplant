import React, { useContext } from "react";
import { Route, Routes, BrowserRouter as Router, Outlet, Navigate } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import UserDashboard from "./pages/User/UserDashboard";
import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import PrivateRoute from "./routes/PrivateRoute";
import UserProvider, { UserContext } from "./context/userContext";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import UserSetting from "./pages/User/UserSetting";
import Setting from "./pages/Admin/Setting";
import PretestPage from "./pages/User/DetailTask/PretestPage";
import PretestAdmin from "./pages/Admin/DetailTask/PretestAdmin";
import PostestAdmin from "./pages/Admin/DetailTask/PostestAdmin";
import PretestListAnswer from "./pages/Admin/AnswerTask/PretestListAnswer";
import PretestAnswerDetail from "./pages/Admin/DetailAnswer/PretestAnswerDetail";
import PretestResultAnswer from "./pages/User/ResultAnswer/PretestResultAnswer";
import SurveyPage from "./pages/User/Surveypage";
import ProblemListAnswer from "./pages/Admin/AnswerTask/ProblemListAnswer";
import ProblemAdmin from "./pages/Admin/DetailTask/ProblemAdmin";
import EditProblemByGroup from "./pages/Admin/DetailTask/EditProblemByGroup";
import PostestListAnswer from "./pages/Admin/AnswerTask/PostestListAnswer";
import PostestAnswerDetail from "./pages/Admin/DetailAnswer/PostestAnswerDetail";
import PostestPage from "./pages/User/DetailTask/PostestPage";
import PostestResultAnswer from "./pages/User/ResultAnswer/PostestResultAnswer";
import ProblemPage from "./pages/User/DetailTask/ProblemPage";
import ProblemGroupPage from "./pages/User/DetailTask/ProblemGroupPage";
import ProblemResultAnswer from "./pages/User/ResultAnswer/ProblemResultAnswer";
import ProblemAnswerDetail from "./pages/Admin/DetailAnswer/ProblemAnswerDetail";
import MindmapAdmin from "./pages/Admin/DetailTask/MindmapAdmin";
import MindmapListAnswer from "./pages/Admin/AnswerTask/MindmapListAnswer";
import MindmapPage from "./pages/User/DetailTask/MindmapPage";
import MindmapResultAnswer from "./pages/User/ResultAnswer/MindmapResultAnswer";
import MindmapAnswerDetail from "./pages/Admin/DetailAnswer/MindmapAnswerDetail";
import RefleksiAdmin from "./pages/Admin/DetailTask/RefleksiAdmin";
import RefleksiListAnswer from "./pages/Admin/AnswerTask/RefleksiListAnswer";
import RefleksiAnswerDetail from "./pages/Admin/DetailAnswer/RefleksiAnswerDetail";
import RefleksiPage from "./pages/User/DetailTask/RefleksiPage";
import RefleksiResultAnswer from "./pages/User/ResultAnswer/RefleksiResultAnswer";
import MateriAdmin from "./pages/Admin/DetailTask/MateriAdmin";
import MateriPage from "./pages/User/DetailTask/MateriPage";
import GlosariumPage from "./pages/User/DetailTask/GlosariumPage";
import GlosariumAdmin from "./pages/Admin/DetailTask/GlosariumAdmin";
import LoAdmin from "./pages/Admin/DetailTask/LoAdmin";
import LoListAnswer from "./pages/Admin/AnswerTask/LoListAnswer";
import LoPage from "./pages/User/DetailTask/LoPage";
import LoAnswerDetail from "./pages/Admin/DetailAnswer/LoAnswerDetail";
import KbkPage from "./pages/User/DetailTask/KbkPage";
import LoResultAnswer from "./pages/User/ResultAnswer/LoResultAnswer";
import KbkAdmin from "./pages/Admin/DetailTask/KbkAdmin";
import KbkAnswerDetail from "./pages/Admin/DetailAnswer/KbkAnswerDetail";
import KbkListAnswer from "./pages/Admin/AnswerTask/KbkListAnswer";
import KbkResultAnswer from "./pages/User/ResultAnswer/KbkResultAnswer";
import SplashScreen from "./pages/Auth/SplashScreen";
import EPortfolioPage from "./pages/User/DetailTask/EPortfolioPage";
import SurveyResults from "./pages/Admin/SurveyResult";

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/splash" element={<SplashScreen />} />

            {/* Admin */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/tasks" element={<ManageTasks />} />
              <Route path="/admin/create-task" element={<CreateTask />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/surveys" element={<SurveyResults />} />
              <Route path="/admin/setting" element={<Setting />} />

              {/* Pretest */}
              <Route path="/admin/create-task/pretest" element={<PretestAdmin />} />
              <Route path="/admin/list-answer/pretest/:taskId" element={<PretestListAnswer />} />
              <Route path="/admin/answer/pretest/:userId" element={<PretestAnswerDetail />} />

              {/* Postest */}
              <Route path="/admin/create-task/postest" element={<PostestAdmin />} />
              <Route path="/admin/list-answer/postest/:taskId" element={<PostestListAnswer />} />
              <Route path="/admin/answer/postest/:userId" element={<PostestAnswerDetail />} />

              {/* Problem */}
              <Route path="/admin/create-task/problem" element={<ProblemAdmin />} />
              <Route path="/admin/list-answer/problem/:taskId" element={<ProblemListAnswer />} />
              <Route path="/admin/edit-problem/:problemId" element={<EditProblemByGroup />} />
              <Route path="/admin/answer/problem/:taskId/:userId" element={<ProblemAnswerDetail />} />

              {/* Mindmap */}
              <Route path="/admin/create-task/mindmap" element={<MindmapAdmin />} />
              <Route path="/admin/list-answer/mindmap/:taskId" element={<MindmapListAnswer />} />
              <Route path="/admin/answer/mindmap/:taskId/:userId" element={<MindmapAnswerDetail />} />

              {/* Refleksi */}
              <Route path="/admin/create-task/refleksi" element={<RefleksiAdmin />} />
              <Route path="/admin/list-answer/refleksi/:taskId" element={<RefleksiListAnswer />} />
              <Route path="/admin/answer/refleksi/:userId" element={<RefleksiAnswerDetail />} />

              {/* Materi */}
              <Route path="/admin/create-task/materi" element={<MateriAdmin />} />

              {/* Glosarium */}
              <Route path="/admin/create-task/glosarium" element={<GlosariumAdmin />} />

              {/* LO */}
              <Route path="/admin/create-task/lo" element={<LoAdmin />} />
              <Route path="/admin/list-answer/lo/:taskId" element={<LoListAnswer />} />
              <Route path="/admin/answer/lo/:userId" element={<LoAnswerDetail />} />

              {/* KBK */}
              <Route path="/admin/create-task/kbk" element={<KbkAdmin />} />
              <Route path="/admin/list-answer/kbk/:taskId" element={<KbkListAnswer />} />
              <Route path="/admin/answer/kbk/:userId" element={<KbkAnswerDetail />} />
            </Route>

            {/* User */}
            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/tasks" element={<MyTasks />} />
              <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
              <Route path="/survey" element={<SurveyPage />} />
              <Route path="/user/setting" element={<UserSetting />} />

              {/* Pretest */}
              <Route path="/user/pretest/:id" element={<PretestPage />} />
              <Route path="/user/pretest/result/:id" element={<PretestResultAnswer />} />

              {/* Postest */}
              <Route path="/user/postest/:id" element={<PostestPage />} />
              <Route path="/user/postest/result/:id" element={<PostestResultAnswer />} />

              {/* Problem */}
              <Route path="/user/problem/:id" element={<ProblemPage />} />
              <Route path="/user/problem/group/:id" element={<ProblemGroupPage />} />
              <Route path="/user/problem/result/:id" element={<ProblemResultAnswer />} />

              {/* Mindap */}
              <Route path="/user/mindmap/:id" element={<MindmapPage />} />
              <Route path="/user/mindmap/result/:id" element={<MindmapResultAnswer />} />

              {/* Refleksi */}
              <Route path="/user/refleksi/:id" element={<RefleksiPage />} />
              <Route path="/user/refleksi/result/:id" element={<RefleksiResultAnswer />} />

              {/* Materi */}
              <Route path="/user/materi/:id" element={<MateriPage />} />

              {/* Glosarium */}
              <Route path="/user/glosarium/:id" element={<GlosariumPage />} />

              {/* Lo */}
              <Route path="/user/lo/:id" element={<LoPage />} />
              <Route path="/user/lo/result/:id" element={<LoResultAnswer />} />

              {/* Kbk */}
              <Route path="/user/kbk/:id" element={<KbkPage />} />
              <Route path="/user/kbk/result/:id" element={<KbkResultAnswer />} />

              {/* E-Portfolio */}
              <Route path="/user/e-portfolio" element={<EPortfolioPage />} />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Root />} />
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  );
};

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return null;

  if (!user) {
    return <LandingPage />;
  }

  return user.role === "admin" ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/user/dashboard" replace />;
};
