import React, { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import axiosInstance from "../../utils/axiosInstance";
import InfoCard from "../../components/Cards/InfoCard";
import { addThousandsSeparator } from "../../utils/helper";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";
import heroImg from "../../assets/images/hero-img.png";
import logo from "../../assets/images/logo.png";

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

const UserDashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // Prepare Chart Data
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];

    setPieChartData(taskDistributionData);

    const PriorityLevelData = [
      { priority: "High", count: taskPriorityLevels?.High || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
    ];

    setBarChartData(PriorityLevelData);
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_USER_DASHBOARD_DATA);
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  useEffect(() => {
    getDashboardData();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">Selamat Datang! {user?.name}</h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">{moment().format("dddd Do MMM YYYY")}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <img src={heroImg} alt="hero-img" className="w-full" />
        <div className="flex mt-4 gap-5">
          <img src={logo} alt="logo" className="h-20" />
          <div className="flex flex-col">
            <h4 className="text-2xl font-medium">Hubungan Tumbuhan dengan Air</h4>
            <p className="text-md text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
              eu fugiat nulla pariatur.
            </p>
          </div>
        </div>
      </div>

      <div className="card my-5">
        <h2 className="text-2xl font-semibold mb-4">Apa yang akan Anda pelajari</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-800 mb-6">
          <p>✓ Create mobile app designs from scratch</p>
          <p>✓ Create mockups using Figma</p>
          <p>✓ Understand the differences between designing for iOS and Android</p>
          <p>✓ Start a new career as a UI/UX designer</p>
          <p>✓ Create wireframe designs for e-Commerce Project</p>
        </div>

        <h2 className="text-xl font-semibold mb-3">Ketentuan</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-6">
          <li>No pre-knowledge required - we'll teach you everything you need to know</li>
          <li>A PC or Mac is required</li>
          <li>No software is required in advance of the course (all software used in the course is free or has a demo version)</li>
        </ul>

        <h2 className="text-xl font-semibold mb-2">Deskripsi</h2>
        <p className="text-gray-700 mb-2">
          This Course is great for people with absolutely no design experience or experienced designers who want to get up to speed quickly with mobile app design. We’ll introduce you to the art of making beautiful apps. We’ll explore key
          UI and UX concepts that are essential to building good looking and easy to use apps that are loved by users.
        </p>
        <p className="text-gray-700 mb-2">The course has a practical component that takes you step-by-step through the workflow of a professional app designer. From user flow diagrams to wireframing to mockups and prototypes.</p>
        <p className="text-gray-700">Students completing the course will have the knowledge to create beautiful and lovable apps that leave people with a smile on their face.</p>

        <button className="mt-4 text-sm text-green-700 hover:underline">See more</button>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5>Recent Tasks</h5>

              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-base" />
              </button>
            </div>

            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div> */}
    </DashboardLayout>
  );
};

export default UserDashboard;
