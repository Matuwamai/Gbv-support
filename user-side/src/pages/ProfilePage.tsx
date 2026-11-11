import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import EditIcon from "@mui/icons-material/Edit";
import api, { getErrorMessage } from "../lib/api";
import { MAX_UPLOAD_BYTES } from "../lib/media";
import { useAuth } from "../context/auth";
import type { UserProfile } from "../types";
import Avatar from "../components/Avatar";
import UserPostsPage from "./UserPosts";

interface ProfileForm {
  name: string;
  email: string;
  gender: string;
  birthday: string;
  contact: string;
  profileImage: string;
}

const GENDER_LABELS: Record<string, string> = { MALE: "Male", FEMALE: "Female", OTHER: "Other" };

const toForm = (user: UserProfile): ProfileForm => ({
  name: user.name,
  email: user.email,
  gender: GENDER_LABELS[user.gender] ?? user.gender,
  birthday: user.birthday ? new Date(user.birthday).toISOString().split("T")[0] : "",
  contact: user.contact ?? "",
  profileImage: user.profileImage ?? "",
});

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [user, setUser] = useState<ProfileForm>({
    name: "",
    email: "",
    gender: "",
    birthday: "",
    contact: "",
    profileImage: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const userId = currentUser?.id;

  useEffect(() => {
    if (!userId) return;
    const fetchUserData = async () => {
      try {
        const { data } = await api.get<UserProfile>(`/users/${userId}`);
        setUser(toForm(data));
        setPreviewImage(data.profileImage ?? "");
      } catch (error) {
        setMessage({ type: "error", text: getErrorMessage(error, "Could not load your profile.") });
      }
    };
    fetchUserData();
  }, [userId]);

  // Free the temporary preview URL when it is replaced.
  useEffect(() => {
    return () => {
      if (previewImage.startsWith("blob:")) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please choose an image file." });
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setMessage({ type: "error", text: "Image must be smaller than 10MB." });
      return;
    }
    setMessage(null);
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    if (!userId) return;

    const contact = user.contact.trim();
    if (contact && !/^\+?[\d\s()-]{7,20}$/.test(contact)) {
      setMessage({ type: "error", text: "Please enter a valid phone number." });
      return;
    }

    const formData = new FormData();
    formData.append("contact", contact);
    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }

    setSaving(true);
    try {
      const { data } = await api.put<UserProfile>(`/users/${userId}`, formData);
      setUser(toForm(data));
      setSelectedFile(null);
      setPreviewImage(data.profileImage ?? "");
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: getErrorMessage(error, "Failed to update profile. Please try again.") });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2 rounded-lg border bg-white text-gray-700";

  return (
    <div className="min-h-screen p-6 bg-white text-gray-900 mt-14 mx-0">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto p-6 rounded-xl shadow-lg bg-gray-50 border border-gray-300"
      >
        <h2 className="text-2xl font-bold text-purple-700 mb-6">Profile</h2>

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar src={previewImage} name={user.name} size="lg" className="border-4 border-gray-300" />
            <label
              htmlFor="photo"
              className="absolute bottom-0 right-0 bg-purple-600 p-1 rounded-full cursor-pointer"
              title="Change profile picture"
            >
              <EditIcon className="text-white" />
              <span className="sr-only">Change profile picture</span>
            </label>
            <input type="file" id="photo" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
          {selectedFile && <p className="text-sm text-gray-600">New picture selected. Save to apply it.</p>}
        </div>

        {message && (
          <p className={`text-center mt-4 ${message.type === "error" ? "text-red-500" : "text-green-600"}`} role="status">
            {message.text}
          </p>
        )}

        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="profile-name" className="block font-medium">Name</label>
            <input id="profile-name" type="text" className={inputClass} value={user.name} readOnly />
          </div>
          <div>
            <label htmlFor="profile-email" className="block font-medium">Email</label>
            <input id="profile-email" type="email" className={inputClass} value={user.email} readOnly />
          </div>
          <div>
            <label htmlFor="profile-gender" className="block font-medium">Gender</label>
            <input id="profile-gender" type="text" className={inputClass} value={user.gender} readOnly />
          </div>
          <div>
            <label htmlFor="profile-birthday" className="block font-medium">Birthday</label>
            <input id="profile-birthday" type="date" className={inputClass} value={user.birthday} readOnly />
          </div>
          <div>
            <label htmlFor="profile-contact" className="block font-medium">Contact</label>
            <input
              id="profile-contact"
              type="tel"
              className={inputClass}
              placeholder="Enter your phone number"
              value={user.contact}
              onChange={(e) => setUser({ ...user, contact: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 w-full py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
      <UserPostsPage />
    </div>
  );
}
