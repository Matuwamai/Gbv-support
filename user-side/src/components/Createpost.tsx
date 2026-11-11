import { useEffect, useRef, useState, ChangeEvent, FormEvent } from "react";
import { FaRegImage } from "react-icons/fa";
import { X } from "lucide-react";
import api, { getErrorMessage } from "../lib/api";
import { isVideo, MAX_UPLOAD_BYTES } from "../lib/media";

const MAX_POST_LENGTH = 5000;

interface PostCreationProps {
  /** Called after a post has been created so the feed can refresh. */
  onCreated?: () => void;
}

const PostCreation = ({ onCreated }: PostCreationProps) => {
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [postText, setPostText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Release the object URL when the preview changes or the component unmounts.
  useEffect(() => {
    return () => {
      if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    };
  }, [mediaPreview]);

  const clearMedia = () => {
    setSelectedMedia(null);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleMediaSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSuccessMessage("");
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setErrorMessage("Please choose an image or a video.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setErrorMessage("File size exceeds the 10MB limit.");
      return;
    }
    setErrorMessage("");
    setSelectedMedia(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handlePostSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSuccessMessage("");

    if (!postText.trim() && !selectedMedia) {
      setErrorMessage("Post cannot be empty.");
      return;
    }

    const formData = new FormData();
    formData.append("content", postText.trim());
    if (selectedMedia) {
      formData.append("mediaUrl", selectedMedia);
    }

    setSubmitting(true);
    try {
      await api.post("/posts", formData);
      setPostText("");
      clearMedia();
      setErrorMessage("");
      setSuccessMessage("Post created successfully.");
      onCreated?.();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Error creating post. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 w-full max-w-2xl mx-auto mb-6 bg-purple-900 rounded-2xl shadow-xl">
      <form onSubmit={handlePostSubmit} className="w-full">
        <div className="relative">
          <button
            type="button"
            className="w-full h-52 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
            aria-label={selectedMedia ? "Change attached media" : "Attach an image or video"}
          >
            {mediaPreview ? (
              isVideo(selectedMedia) ? (
                <video src={mediaPreview} controls className="w-full h-full rounded-lg" />
              ) : (
                <img src={mediaPreview} alt="Selected" className="w-full h-full object-cover rounded-lg" />
              )
            ) : (
              <span className="flex flex-col items-center gap-2 text-gray-500">
                <FaRegImage className="text-4xl" />
                <span className="text-sm">Add a photo or video (optional)</span>
              </span>
            )}
          </button>
          {selectedMedia && (
            <button
              type="button"
              onClick={clearMedia}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
              aria-label="Remove attached media"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleMediaSelect}
        />
        <textarea
          className="w-full mt-4 p-3 bg-gray-300 text-gray-900 rounded-lg focus:outline-none resize-none text-lg"
          rows={4}
          placeholder="Write something..."
          value={postText}
          maxLength={MAX_POST_LENGTH}
          onChange={(e) => setPostText(e.target.value)}
          aria-label="Post text"
        ></textarea>
        {errorMessage && <p className="text-red-400 text-sm mt-2 font-semibold">{errorMessage}</p>}
        {successMessage && <p className="text-green-400 text-md mt-2 font-semibold">{successMessage}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-4 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition text-lg font-semibold disabled:opacity-60"
        >
          {submitting ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default PostCreation;
