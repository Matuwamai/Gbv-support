import React, { useState, useContext } from "react";
import { FaRegImage } from "react-icons/fa";
import { Authcontext } from "../context/authContext"; 
import axios from "axios";

const PostCreation = () => {
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null); 
  const [mediaPreview, setMediaPreview] = useState<string | null>(null); 
  const [postText, setPostText] = useState<string>(""); 
  const API_BASE_URL  = "http://localhost:3000/api"

  const authContext = useContext(Authcontext);
  const currentUser = authContext?.currentUser;

  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedMedia(file); 
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const response = await axios.post(`${API_BASE_URL}/posts/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    
      console.log("Post created successfully:", response.data);
      setPostText(""); 
      setSelectedMedia(null);
      setMediaPreview(null);
    } catch (error) {
      console.error("Error creating post:", (error as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4  min-h-screen mt-8">
      <div className="w-full max-w-md bg-gray-800 p-4 rounded-2xl shadow-lg">
        <form onSubmit={handlePostSubmit}>
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
          <textarea
            className="w-full mt-4 p-2 bg-gray-700 text-white rounded-lg focus:outline-none resize-none text-sm sm:text-base"
            rows={3}
            placeholder="Write something..."
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition text-sm sm:text-base"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostCreation;
