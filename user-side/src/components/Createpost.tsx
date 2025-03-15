import React, { useState } from "react";
import { FaRegImage } from "react-icons/fa";

const PostCreation = () => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [postText, setPostText] = useState("");

  const handleMediaSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setSelectedMedia(fileURL);
    }
  };

  const handlePostSubmit = async () => {
    const formData = new FormData();
    formData.append("text", postText);
    if (selectedMedia) {
      const response = await fetch(selectedMedia);
      const blob = await response.blob();
      formData.append("media", blob, "uploadedMedia");
    }

    try {
      const response = await fetch("http://localhost:5000/api/posts/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Post created successfully");
        setPostText("");
        setSelectedMedia(null);
      } else {
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-900 min-h-screen">
      <div className="w-80 bg-gray-800 p-4 rounded-2xl shadow-lg">
        <div
          className="w-full h-40 bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600 transition"
          onClick={() => document.getElementById("mediaInput").click()}
        >
          {selectedMedia ? (
            selectedMedia.endsWith(".mp4") || selectedMedia.endsWith(".webm") ? (
              <video src={selectedMedia} controls className="w-full h-full rounded-lg" />
            ) : (
              <img src={selectedMedia} alt="Selected" className="w-full h-full rounded-lg" />
            )
          ) : (
            <FaRegImage className="text-white text-3xl" />
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
          className="w-full mt-4 p-2 bg-gray-700 text-white rounded-lg focus:outline-none"
          rows="3"
          placeholder="Write something..."
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        ></textarea>

        <button
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          onClick={handlePostSubmit}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default PostCreation;
