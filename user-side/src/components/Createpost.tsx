import React, { useState, useContext } from "react";
import { FaRegImage } from "react-icons/fa";
import { Authcontext } from "../context/authContext"; // Import AuthContext
import axios from "axios";

const PostCreation = () => {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [postText, setPostText] = useState<{ id: number; text: string }[]>([]);

  // Get current user from context
  const authContext = useContext(Authcontext);
  const currentUser = authContext?.currentUser;

  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setSelectedMedia(fileURL);
    }
  }; const handlePostSubmit = async () => {
    if (!currentUser?.id) {
      console.error("User not logged in.");
      return;
    }

    console.log("Current User:", currentUser);
    console.log("User ID being sent:", currentUser.id);

    const formData = new FormData();
    formData.append("content", postText);

    if (selectedMedia) {
      try {
        const response = await fetch(selectedMedia);
        const blob = await response.blob();
        formData.append("media", blob, "uploadedMedia");
      } catch (error) {
        console.error("Error processing media:", error);
        return;
      }
    }

    try {
      const response = await axios.post("http://localhost:5000/api/posts/", {
          content: postText,
          userId: currentUser.id, 
      });

      if (response.ok) {
        console.log("Post created successfully");
        setPostText("");
        setSelectedMedia(null);
      } 
      // else {
      //   const errorData = await response.json();
      //   console.error("Failed to create post:", errorData.message || "Unknown error");
      // }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  ;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-400 min-h-screen">
      <div className="w-full max-w-md bg-gray-800 p-4 rounded-2xl shadow-lg">
        {/* Media Upload Section */}
        <div
          className="w-full h-40 sm:h-48 bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600 transition"
          onClick={() => document.getElementById("mediaInput")?.click()}
        >
          {selectedMedia ? (
            selectedMedia.endsWith(".mp4") || selectedMedia.endsWith(".webm") ? (
              <video src={selectedMedia} controls className="w-full h-full rounded-lg" />
            ) : (
              <img src={selectedMedia} alt="Selected" className="w-full h-full object-cover rounded-lg" />
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
