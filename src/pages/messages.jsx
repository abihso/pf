import axios from "axios";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { IoIosClose } from "react-icons/io"; 

const Messages = ({ userData }) => {
  const [data, setData] = useState([])
  const [refresh, setRefresh] = useState(0)
  const [message, setMessage] = useState({
    by: "",
    message: "",
    id: null,
    title : ""
  })
  const [closeModal, setCloseModal] = useState(false)
  
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_HOST}/admin/get-all-message`)
      .then((res) => setData(res.data.data))
      .catch(err => console.log(err))
  }, [refresh])
  
  // Functions
  const getSingleMessage = async (id) => {
    await axios.get(`${import.meta.env.VITE_HOST}/admin/get-single-message/${id}`)
      .then(res => {
        setMessage(res.data.data[0])
      }).catch(err => console.log(err))
  }
  
  const deleteMessage = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      await axios.delete(`${import.meta.env.VITE_HOST}/admin/delete-message/${id}`)
        .then(() => {
          setRefresh(refresh + 1)
        }).catch(err => console.log(err))
    }
  }
  
  return (
    <div className="space-y-4 px-2 sm:px-0">
      {/* Message Detail Modal */}
      {
        closeModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-[#1A1A2E] rounded-md p-5 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-end">
                <IoIosClose 
                  className="text-red-500 text-4xl cursor-pointer" 
                  onClick={() => setCloseModal(false)} 
                />
              </div>
              <p className="text-white font-bold mt-5 text-xl break-words">{message.title}</p>
              <p className="text-white font-bold mt-3 text-base break-words whitespace-pre-wrap">
                {message.message}
              </p>
              <p className="underline text-red-400 mt-4 text-sm">
                sent by: {message.by}
              </p>
            </div>
          </div>
        )
      }
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <p>
            <span className="font-bold text-xl sm:text-2xl">Dashboard</span>{" "}
            <span className="text-xs sm:text-sm font-bold text-[#54A3E2]">/ messages</span>
          </p>
          <p className="text-xs text-[#AAAAAA]">welcome back, {userData.fname}</p>
        </div>
        <span className="text-xs text-[#AAAAAA]">
          {new Date().toDateString()}
        </span>
      </div>

      {/* Messages Table */}
      <div className="min-h-72 py-3 px-2 sm:px-3 bg-[#FBFBFB] rounded-md">
        <p className="font-bold text-base sm:text-lg mb-3">All Messages</p>

        {/* Search Bar */}
        <div className="w-full mb-4">
          <div className="relative w-full sm:w-2/5">
            <input
              type="search"
              placeholder="Search"
              className="bg-[#F6F6FB] p-2 w-full rounded-lg pl-9 text-[#6B7280] outline-none"
            />
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B2BEC6]" />
          </div>
        </div>

        {/* Scrollable table - Same structure as original but responsive */}
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <div className="min-w-[600px] sm:min-w-full px-2 sm:px-0">
            {/* Table Header */}
            <div className="grid grid-cols-12 text-xs sm:text-sm font-bold text-gray-500 border-b pb-2">
              <div className="col-span-2">S/n</div>
              <div className="col-span-3">Name</div>
              <div className="col-span-4">Message</div>
              <div className="col-span-3">Action</div>
            </div>

            {/* Table Rows */}
            {data.length > 0 ? (
              data.map((item, index) => (
                <div
                  key={item.id || index}
                  className="grid grid-cols-12 mt-3 text-xs sm:text-sm items-center border-b pb-2"
                >
                  <div className="col-span-2">{index + 1}</div>
                  <div className="col-span-3 font-medium truncate pr-1">{item.by}</div>
                  <div className="col-span-4 text-gray-500 truncate pr-2">
                    {item.message}
                  </div>
                  <div className="col-span-3 flex gap-2 sm:gap-3">
                    <button 
                      className="text-blue-500 text-xs font-bold whitespace-nowrap" 
                      onClick={() => {
                        getSingleMessage(item.id)
                        setCloseModal(true)
                      }}
                    >
                      View
                    </button>
                    {
                      userData.status == "admin" && (
                        <button 
                          className="text-red-500 text-xs font-bold whitespace-nowrap" 
                          onClick={() => deleteMessage(item.id)}
                        >
                          Delete
                        </button>
                      )
                    }
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 col-span-12">
                No messages found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;