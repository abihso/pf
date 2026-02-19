import { AiOutlineArrowUp } from "react-icons/ai";
const StatCard = ({ icon, title, value, subtitle }) => (
  <div className="w-full h-24 rounded-md bg-[#FBFBFB] py-2 px-3 overflow-hidden">
    <span className="flex items-center gap-2">
      {icon}
      <p className="text-[#AAAAAA] font-bold text-sm">{title}</p>
    </span>
    <p className="font-black mt-2 ml-2 mb-1">{value}</p>
    <span className="flex items-center text-xs gap-1 text-green-400 font-bold">
      <AiOutlineArrowUp />
      <p>{subtitle}</p>
    </span>
  </div>
);

export default StatCard