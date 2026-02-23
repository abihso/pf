import { useState } from "react";
import axios from "axios";

const Settings = ({ userData }) => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Notification states
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "" // success, error
  });

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (next !== confirm) {
      showNotification("Passwords do not match", "error");
      setLoading(false);
      return;
    }

    axios.patch(`${import.meta.env.VITE_HOST}/auth/update-password`, {
      pin: userData.memberpin,
      oldPassword: current,
      newPassword: next
    }).then(() => {
      showNotification("Password updated successfully!", "success");
      setCurrent("");
      setNext("");
      setConfirm("");
    }).catch(err => {
      console.log(err)
      showNotification(err.response?.data?.message || "Error updating password", "error");
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="space-y-6 px-2 sm:px-0 relative">
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[100] w-11/12 max-w-md animate-slide-down">
          <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <p>
            <span className="font-bold text-xl sm:text-2xl">Dashboard</span>{" "}
            <span className="text-xs sm:text-sm font-bold text-[#54A3E2]">/ settings</span>
          </p>
          <p className="text-xs text-[#AAAAAA]">
            welcome back, {userData?.fname}
          </p>
        </div>
        <span className="text-xs text-[#AAAAAA]">
          {new Date().toDateString()}
        </span>
      </div>

      {/* Change Password */}
      <div className="bg-white dark:bg-[#0f172a] p-4 sm:p-6 rounded-xl shadow space-y-4 max-w-md mx-auto sm:mx-0">
        <h2 className="font-semibold text-base sm:text-lg">Change Password</h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs sm:text-sm text-gray-500">Current password</label>
            <input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              className="w-full p-2 sm:p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#54A3E2] text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs sm:text-sm text-gray-500">New password</label>
            <input
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className="w-full p-2 sm:p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#54A3E2] text-sm"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs sm:text-sm text-gray-500">
              Confirm new password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full p-2 sm:p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#54A3E2] text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-[#54A3E2] text-white rounded-lg hover:opacity-90 disabled:opacity-60 text-sm sm:text-base transition-colors"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      
    </div>
  );
};

export default Settings;