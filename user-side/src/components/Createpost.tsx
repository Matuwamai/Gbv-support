import React, { useState, useContext } from "react";
import { FaRegImage } from "react-icons/fa";
import { Authcontext } from "../context/authContext";
import axios from "axios";

const PostCreation = () => {
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [postText, setPostText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSucceMessage] = useState<string>("");
  const API_BASE_URL = "http://localhost:3000/api";
  const authContext = useContext(Authcontext);
  const currentUser = authContext?.currentUser;

  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { 
        setErrorMessage("File size exceeds 10MB limit.");
        return;
      }
      setErrorMessage("");
      setSucceMessage("");
      setSelectedMedia(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // e.preventDefault();
    
    if (!currentUser?.id) {
      setErrorMessage("You must be logged in to post.");
      return;
    }
    if (!postText.trim() && !selectedMedia) {
      setErrorMessage("Post cannot be empty.");
      return;
    }
    
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
      setErrorMessage("");
      setSucceMessage("Post created Succefully");
    } catch (error) {
      setErrorMessage("Error creating post. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-2xl mx-auto mb-6 bg-purple-900 rounded-2xl shadow-xl">
      <form onSubmit={handlePostSubmit} className="w-full">
        <div
          className="w-full h-52 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition"
          onClick={() => document.getElementById("mediaInput")?.click()}
        >
          {mediaPreview ? (
            mediaPreview.endsWith(".mp4") || mediaPreview.endsWith(".webm") ? (
              <video src={mediaPreview} controls className="w-full h-full rounded-lg" />
            ) : (
              <img src={mediaPreview} alt="Selected" className="w-full h-full object-cover rounded-lg" />
            )
          ) : (
            <FaRegImage className="text-white text-4xl" />
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
          className="w-full mt-4 p-3 bg-gray-300 text-gray-900 rounded-lg focus:outline-none resize-none text-lg"
          rows={4}
          placeholder="Write something..."
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        ></textarea>
        {errorMessage && <p className="text-red-500 text-sm mt-2 font-semibold">{errorMessage}</p>}
        {successMessage && <p className="text-green-400 text-md mt-2 font-semibold">{successMessage}</p>}
        <button
          type="submit"
          className="w-full mt-4 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition text-lg font-semibold"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default PostCreation;
