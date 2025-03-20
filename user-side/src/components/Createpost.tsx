import React, { useState, useContext } from "react";
import { FaRegImage } from "react-icons/fa";
import { Authcontext } from "../context/authContext"; // Import AuthContext
import axios from "axios";

const PostCreation = () => {
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null); 
  const [mediaPreview, setMediaPreview] = useState<string | null>(null); // ✅ Store preview separately
  const [postText, setPostText] = useState<string>(""); // ✅ Use string instead of an array

  // Get current user from context
  const authContext = useContext(Authcontext);
  const currentUser = authContext?.currentUser;

  // ✅ Handle media selection correctly
  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedMedia(file); // Store the actual file
      setMediaPreview(URL.createObjectURL(file)); // Create preview URL
    }
  };

  // ✅ Handle post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser?.id) {
      console.error("User not logged in.");
      return;
    }
    
      console.log("Current User:", currentUser);
      console.log("User ID being sent:", currentUser.id);
    
      const formData = new FormData();
      formData.append("content", postText);
      formData.append("userId", currentUser.id.toString());
    
      if (selectedMedia) {
        formData.append("mediaUrl", selectedMedia);
      }
    
      try {
        const response = await axios.post("http://localhost:5000/api/posts/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
    
        console.log("Post created successfully:", response.data);
        setPostText(""); // ✅ Clear input
        setSelectedMedia(null);
        setMediaPreview(null);
      } catch (error) {
        console.error("Error creating post:", error.response?.data || error);
      }
    };
    
  return (
    <div className="flex flex-col items-center justify-center p-4  min-h-screen mt-6">
      <div className="w-full max-w-md bg-gray-800 p-4 rounded-2xl shadow-lg">
        {/* Media Upload Section */}
        <div
          className="w-full h-40 sm:h-48 bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600 transition"
          onClick={() => document.getElementById("mediaInput")?.click()}
        >
          {mediaPreview ? (
            mediaPreview.endsWith(".mp4") || mediaPreview.endsWith(".webm") ? (
              <video src={mediaPreview} controls className="w-full h-full rounded-lg" />
            ) : (
              <img src={mediaPreview} alt="Selected" className="w-full h-full object-cover rounded-lg" />
            )
          ) : (
            <FaRegImage className="text-white text-3xl sm:text-4xl" />
          )}
        </div>

        <input
          type="file"
          id="mediaInput"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleMediaSelect}
        />

        {/* Text Input */}
        <textarea
          className="w-full mt-4 p-2 bg-gray-700 text-white rounded-lg focus:outline-none resize-none text-sm sm:text-base"
          rows={3}
          placeholder="Write something..."
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        ></textarea>

        {/* Post Button */}
        <button
          className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition text-sm sm:text-base"
          onClick={handlePostSubmit}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default PostCreation;
