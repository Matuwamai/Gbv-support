import { useState, useEffect } from "react";
import axios from "axios";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
const API_BASE_URL = "http://localhost:3000/api"


export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    gender: "",
    birthday: "",
    contact: "",
    profileImage: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("https://via.placeholder.com/100");
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.id) {
        async function fetchUserData() {
          try {
            const response = await axios.get(`${API_BASE_URL}/users/${parsedUser.id}`);
            setUser(response.data);
            if (response.data.profileImage) {
              setPreviewImage(`${API_BASE_URL}${response.data.profileImage}`);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
        fetchUserData();
      }
    }
  }, []);
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("User not found. Please log in again.");
      return;
    }
  
    const parsedUser = JSON.parse(storedUser);
  
    const formData = new FormData();
    formData.append("contact", user.contact);
    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }
  
    try {
      await axios.put(`${API_BASE_URL}/users/${parsedUser.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  

  return (
    <div className={`min-h-screen p-6 bg-white text-white mt-14 mx-0`}>
      <div className="max-w-2xl mx-auto p-6 rounded-xl shadow-lg bg-gray-100 dark:bg-purple-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Profile</h2>
        </div>

        <div className="flex flex-col items-center gap-4">
      <label htmlFor="photo" className="cursor-pointer">
      {previewImage || user.profileImage ? (
          <img
            src={previewImage || user.profileImage} 
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-gray-300 dark:border-gray-600 object-cover"
          />
        ) : (
          <AccountCircleIcon className="w-24 h-24 text-gray-400" /> 
        )}
      </label>
      <input type="file" id="photo" className="hidden" onChange={handleImageChange} />
    </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input type="text" className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700" value={user.name} readOnly />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input type="email" className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700" value={user.email} readOnly />
          </div>
          <div>
            <label className="block font-medium">Gender</label>
            <input type="text" className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700" value={user.gender} readOnly />
          </div>
          <div>
            <label className="block font-medium">Birthday</label>
            <input type="date" className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700" value={user.birthday} readOnly />
          </div>
          <div>
            <label className="block font-medium">Contact</label>
            <input
              type="tel"
              className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700"
              placeholder="Enter new contact number"
              value={user.contact}
              onChange={(e) => setUser({ ...user, contact: e.target.value })}
            />
          </div>
        </div>

        <button onClick={handleSubmit} className="mt-6 w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  );
}
