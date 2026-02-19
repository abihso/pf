const ActionButton = ({ icon, text,setModal,status }) => {
  return (
    <a
      onClick={() => setModal(status)}
      className="dark:bg-accent-dark bg-accent rounded-lg p-4 text-white flex flex-col items-center justify-center text-center hover:opacity-90 transition-opacity"
    >
      <span className="text-2xl mb-2">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </a>
  );
};

export default ActionButton;