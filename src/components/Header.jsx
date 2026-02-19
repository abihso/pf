import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';
const Header = ({ toggleSidebar, name, pin }) => {
  const { darkMode, toggleTheme } = useTheme();
  const handleLogout = () => {
    axios
      .get(`${import.meta.env.VITE_HOST}/logout/${pin}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      }).finally(() => window.location.href = "/")
    
  };
  return (
    <header className="sticky top-0 z-50 dark:bg-secondary-dark bg-secondary-light border-b dark:border-border-dark border-border-light p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-xl dark:text-text-primary-dark text-text-primary-light"
        >
          ☰
        </button>
        <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-lg">
          P
        </div>
        <span className="font-semibold text-lg dark:text-text-primary-dark text-text-primary-light hidden sm:block">
          PEUAW
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:dark:bg-accent-dark hover:bg-accent-light"
          title="Toggle theme"
        >
          {darkMode ? "🌞" : "🌙"}
        </button>
        <div className="flex items-center gap-2">
          <div
            onMouseOver={() => setProfile(true)}
            className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm"
          >
            {name}
        
          </div>
        </div>
        <button
          className="bg-cyan-700 p-2 rounded-md hover:bg-red-300"
          onClick={handleLogout}
        >
          logout
        </button>
      </div>
    </header>
  );
};

export default Header;