import { useState } from "react";
import { Switch } from "@headlessui/react";

export default function ProfilePage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="max-w-2xl mx-auto p-6 rounded-xl shadow-lg bg-gray-100 dark:bg-purple-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Profile</h2>
          <Switch
            checked={darkMode}
            onChange={setDarkMode}
            className={`${darkMode ? "bg-blue-600" : "bg-gray-300"} relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${darkMode ? "translate-x-6" : "translate-x-1"} inline-block h-4 w-4 transform bg-white rounded-full transition`}
            />
          </Switch>
        </div>

        <div className="flex flex-col items-center gap-4">
          <label htmlFor="photo" className="cursor-pointer">
            <img
              src="https://via.placeholder.com/100"
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-gray-300 dark:border-gray-600"
            />
          </label>
          <input type="file" id="photo" className="hidden" />
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input type="text" className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700" placeholder="Your Name" />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input type="email" className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700" placeholder="Your Email" />
          </div>
          <div>
            <label className="block font-medium">Phone</label>
            <input type="tel" className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700" placeholder="Your Phone Number" />
          </div>
        </div>

        <button className="mt-6 w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">Save Changes</button>
      </div>
    </div>
  );
}
