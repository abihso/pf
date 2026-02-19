
const Sidebar = ({
  activePage,
  setActivePage,
  sidebarOpen,
  closeSidebar,
  navItems,

}) => {
  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed md:static z-50 w-64 !min-h-screen dark:bg-secondary-dark bg-secondary-light border-r dark:border-border-dark border-border-light transition-transform duration-300 ease-in-out transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <ul className="p-4 mt-4">
          {navItems.map((item) => (
            <li key={item.page} className="mb-2">
              <button
                onClick={() => {
                  setActivePage(item.page);
                  closeSidebar();
                }}
                className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
                  activePage === item.page
                    ? "dark:bg-accent-dark bg-accent-light text-white"
                    : "dark:hover:bg-accent-dark hover:bg-accent-light dark:text-text-primary-dark text-text-primary-light"
                }`}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <span>{item.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;