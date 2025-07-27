import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { HiOutlineCamera } from "react-icons/hi";
import toast from "react-hot-toast";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import uploadImage from "../../utils/uploadImage";
import avatar from "../../assets/images/avatar.png";

const UserSetting = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nim: "",
    offering: "",
    email: "",
    username: "",
    password: "",
    profileImageUrl: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        nim: user.nim || "",
        offering: user.offering || "",
        email: user.email || "",
        username: user.username || "",
        password: "",
        profileImageUrl: user.profileImageUrl || "",
        role: user.role || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      toast.loading("Mengunggah foto...", { id: "uploading" });
      const { imageUrl } = await uploadImage(file);
      setFormData((prev) => ({ ...prev, profileImageUrl: imageUrl }));
      toast.success("Foto berhasil diunggah!", { id: "uploading" });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Gagal mengunggah gambar", { id: "uploading" });
    }
  };

  const updateUserProfile = async () => {
    setLoading(true);

    try {
      const { name, nim, offering, email, username, password, profileImageUrl, role } = formData;

      if (!name || !nim || !offering || !email) {
        toast.error("Semua field wajib diisi!");
        setLoading(false);
        return;
      }

      const payload = {
        name,
        nim,
        offering,
        email,
        username,
        password,
        profileImageUrl,
        role,
      };
      await axiosInstance.put(API_PATHS.USERS.UPDATE_USER_BY_ID(user._id), payload);

      toast.success("Profil berhasil diperbarui!");
    } catch (error) {
      console.error("Error updating profile:", error);
      const message = error.response?.data?.message || "Gagal memperbarui profil";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return;
    await updateUserProfile();
  };

  return (
    <DashboardLayout activeMenu="Settings">
      <div className="max-w-md mx-auto mt-4 p-4 bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profil</label>
            <div className="flex items-center justify-center gap-4">
              <div className="relative">
                <img src={formData.profileImageUrl || avatar} alt="Profile" className="w-28 h-28 rounded-full object-cover border" />
                <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 shadow cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  <HiOutlineCamera className="w-5 h-5 text-white" />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Nama</label>
            <input name="name" value={formData.name} onChange={handleChange} className="w-full border-2 border-gray-300 rounded px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">NIM</label>
            <input name="nim" value={formData.nim} onChange={handleChange} className="w-full border-2 border-gray-300 rounded px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Offering</label>
            <input name="offering" value={formData.offering} onChange={handleChange} className="w-full border-2 border-gray-300 rounded px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full border-2 border-gray-300 rounded px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Username</label>
            <input name="username" value={formData.username} onChange={handleChange} className="w-full border-2 border-gray-300 rounded px-3 py-2 mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full border-2 border-gray-300 rounded px-3 py-2 mt-1" />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
            Simpan
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default UserSetting;
