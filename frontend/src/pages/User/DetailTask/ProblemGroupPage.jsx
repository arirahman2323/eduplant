import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { HiChevronLeft } from "react-icons/hi";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { GiBackwardTime } from "react-icons/gi";
import toast from "react-hot-toast";
import { UserContext } from "../../../context/userContext";
import io from "socket.io-client";
import socket from "../../../utils/socket";

// const socket = io("https://eduplant-be.vercel.app/");
// const socket = io("http://localhost:8000");

const ProblemGroupPage = () => {
  const { id: problemId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { taskId, groupNumber } = state || {};

  const [task, setTask] = useState(null);
  const [problem, setProblem] = useState(null);
  const [answerText, setAnswerText] = useState("");
  const [discussionFile, setDiscussionFile] = useState(null);
  const [answerFiles, setAnswerFiles] = useState([]);
  const [submission, setSubmission] = useState(null);
  const { user } = useContext(UserContext);

  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [joined, setJoined] = useState(false);
  const messageEndRef = useRef(null);
  const discussionFileRef = useRef(null);
  const answerFilesRef = useRef(null);

  const getTaskAndSubmission = async () => {
    try {
      const resTask = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
      const taskData = resTask.data;
      const foundProblem = (taskData.problem || []).find((p) => p._id === problemId);
      if (!foundProblem) return;

      setTask(taskData);
      setProblem(foundProblem);

      const resGroup = await axiosInstance.get(`/api/groups/problem/${problemId}`);
      setGroup(resGroup.data);
      socket.emit("join-group", resGroup.data._id);

      const resMsg = await axiosInstance.get(`/api/groups/${resGroup.data._id}/messages`);
      setMessages(resMsg.data);

      // Ambil submission terbaru
      const resSub = await axiosInstance.get(API_PATHS.TASKS.GET_SUBMISSION_BY_ID_USER("problem", user._id));
      const userSubmissions = (resSub.data?.submissions || []).filter((s) => s.task._id === taskId);

      if (userSubmissions.length > 0) {
        const latestSubmission = userSubmissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        setSubmission(latestSubmission);
        const existingAnswer = latestSubmission.problemAnswer?.find((a) => a.questionId === problemId);
        if (existingAnswer) {
          setAnswerText(existingAnswer.problem || "");
          // (Menampilkan file yang sudah ada dilakukan di JSX)
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data");
    }
  };

  useEffect(() => {
    if (taskId && problemId && user?._id) {
      getTaskAndSubmission();
    }
    return () => {
      if (group?._id) socket.emit("leave-group", group._id);
    };
  }, [taskId, problemId, user]);

  useEffect(() => {
    socket.on("group:message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("group:message");
    };
  }, [group?._id]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const getSubmission = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.TASKS.GET_SUBMISSION_BY_ID_USER("problem", user._id));
      const data = res.data.submissions.find((s) => s.task._id === taskId);
      if (data) {
        setSubmission(data);

        // Cek apakah ada jawaban untuk problemId ini
        const existing = data.problemAnswer?.find((a) => a.questionId === problemId);
        if (existing) setAnswer(existing.problem);
      }
    } catch (err) {
      console.error("Error fetching submission:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answerText) {
      toast.error("Jawaban teks tidak boleh kosong.");
      return;
    }

    if (submission) {
      const isConfirmed = window.confirm("Mengirim ulang akan membuat lembar jawaban baru dan nilai sebelumnya tidak berlaku lagi. Lanjutkan?");
      if (!isConfirmed) return;
    }

    const formData = new FormData();
    formData.append("problemAnswer", JSON.stringify([{ questionId: problemId, problem: answerText, groupId: problem.groupId }]));

    if (discussionFile) {
      formData.append("files", discussionFile);
    }
    answerFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await axiosInstance.post(API_PATHS.TASKS.POST_SUBMISSION_BY_TASK_ID("problem", taskId), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Jawaban berhasil dikirim!");
      setDiscussionFile(null);
      setAnswerFiles([]);
      if (discussionFileRef.current) {
        discussionFileRef.current.value = "";
      }
      if (answerFilesRef.current) {
        answerFilesRef.current.value = "";
      }
      await getTaskAndSubmission(); // Refresh data
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Gagal mengirim jawaban");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage || !group?._id || !joined) return;
    try {
      await axiosInstance.post(`/api/groups/${group._id}/send`, {
        message: newMessage,
      });
      setNewMessage("");
    } catch (err) {
      toast.error("Gagal mengirim pesan");
    }
  };

  if (!task || !problem) return <div className="text-center mt-10">Memuat...</div>;

  return (
    <DashboardLayout activeMenu="Courses">
      <div className="flex flex-col md:flex-row gap-6 p-6">
        <div className="flex-1">
          <button onClick={() => navigate(`/user/problem/${taskId}`)} className="flex items-center mb-4 text-blue-600 hover:underline cursor-pointer">
            <HiChevronLeft className="mr-1" /> Kembali
          </button>

          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p className="text-gray-600">{task.description}</p>
            <div className="mt-11 h-2 bg-blue-500 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">Kelompok {groupNumber}</h3>
              <h3 className="font-semibold mb-2">Permasalahan :</h3>
              <p className="mb-2">{problem.problem}</p>

              {problem.pdfFiles && problem.pdfFiles.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <h4 className="font-semibold text-md mb-2 text-gray-800">File Soal Terlampir:</h4>
                  <div className="space-y-6">
                    {problem.pdfFiles.map((fileUrl, index) => (
                      <div key={index}>
                        <p className="text-sm text-gray-600 mb-1 font-medium">
                          File {index + 1}: {decodeURI(fileUrl.split("/").pop())}
                        </p>
                        <iframe src={encodeURI(fileUrl)} width="100%" height="600px" style={{ border: "1px solid #ccc", borderRadius: "8px" }} title={`File Soal ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">Kolom Diskusi</h3>
              <div className="h-60 overflow-y-auto border p-2 rounded mb-3 bg-gray-50" id="chat-box">
                {messages?.map((msg, i) => {
                  const isMe = msg?.senderId?._id === user?._id;
                  return (
                    <div key={i} className={`flex mb-3 ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] ${isMe ? "text-right" : "text-left"}`}>
                        {!isMe && (
                          <div className="flex items-center gap-2 mb-1">
                            {msg?.senderId?.profileImageUrl ? (
                              <img src={msg.senderId.profileImageUrl} className="w-6 h-6 rounded-full" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-xs text-gray-700">👤</span>
                              </div>
                            )}
                            <span className="text-xs text-gray-500">{msg.senderId?.name || "Anonim"}</span>
                          </div>
                        )}

                        <div className={`px-4 py-2 rounded-lg text-sm ${isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"}`}>{msg.message}</div>

                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(msg.createdAt).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messageEndRef} />
              </div>

              <div className="flex gap-2">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="Tulis pesan..." />
                <button type="button" onClick={handleSendMessage} className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                  Kirim
                </button>
              </div>
            </div> */}

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold text-lg mb-2">Jawaban Kelompok</h3>

              <label className="block text-sm font-medium mb-1">Jawaban Teks</label>
              <textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)} className="w-full border-2 mb-4 border-gray-300 rounded px-3 py-2" rows={5} placeholder="Tulis jawaban kelompok Anda..." />

              <label className="block text-sm font-medium mb-1">Upload File Hasil Diskusi (1 PDF)</label>
              <input ref={discussionFileRef} type="file" accept=".pdf" onChange={(e) => setDiscussionFile(e.target.files[0])} className="w-full text-sm p-2 border-2 border-gray-300 rounded" />
              {submission?.discussionFile && (
                <a href={submission.discussionFile} target="_blank" className="text-xs text-green-600 underline">
                  Lihat file diskusi yang sudah diupload
                </a>
              )}

              <label className="block text-sm font-medium mb-1 mt-4">Upload File Jawaban (Bisa lebih dari 1 PDF)</label>
              <input ref={answerFilesRef} type="file" multiple accept=".pdf" onChange={(e) => setAnswerFiles(Array.from(e.target.files))} className="w-full text-sm p-2 border-2 border-gray-300 rounded" />
              {submission?.pdfFiles && submission.pdfFiles.length > 0 && (
                <div className="mt-1 text-xs text-green-600">
                  <p>File jawaban yang sudah diupload:</p>
                  <ul className="list-disc list-inside">
                    {submission.pdfFiles.map((f, i) => (
                      <li key={i}>
                        <a href={f} target="_blank" className="underline">
                          {f.split("/").pop()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button type="submit" className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white text-lg py-2.5 rounded-md">
                {submission ? "Kirim Ulang Jawaban" : "Kumpulkan"}
              </button>
              <button
                type="button"
                disabled={!submission || submission.score === null || submission.score === undefined}
                className={`w-full ${submission && submission.score !== null && submission.score !== undefined ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-300"} text-white mt-4 text-lg py-2.5 rounded-md`}
                onClick={() => navigate(`/user/problem/result/${taskId}`)}
              >
                Lihat Nilai
              </button>
            </div>
          </form>
        </div>

        <div className="w-full mt-10 md:w-72 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-2">Batas Waktu</h4>
            <p className="text-sm flex gap-1 text-gray-400 font-medium">
              <GiBackwardTime className="text-xl" />
              {new Date(task.dueDate).toLocaleString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-sm mt-8 text-gray-400 font-medium">Status: {task.status === "Completed" ? "Selesai" : "Belum Selesai"}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProblemGroupPage;
