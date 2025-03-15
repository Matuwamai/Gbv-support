import { useState } from "react";
import axios from "axios";

const NewPost = () => {
  const [text, setText] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setMedia(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() && !media) {
      setError("Post cannot be empty");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("text", text);
    if (media) {
      formData.append("media", media);
    }

    try {
      await axios.post("/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset form
      setText("");
      setMedia(null);
    } catch (err) {
      setError("Failed to create post");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <textarea
        className="w-full p-2 border rounded-md"
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      
      <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="mt-2" />

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-3"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </div>
  );
};

export default NewPost;
