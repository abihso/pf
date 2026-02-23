import { FaRegEye } from "react-icons/fa"; 
import { GrFormCheckmark } from "react-icons/gr"; 
import { IoIosClose } from "react-icons/io"; 
import React, { useState,useEffect } from "react";
import { BiPlus, BiSearch, BiDoughnutChart } from "react-icons/bi";
import { RiUpload2Line, RiMenuAddLine } from "react-icons/ri";
import { IoMdSend } from "react-icons/io";
import { AiTwotoneSetting, AiOutlineArrowUp } from "react-icons/ai";
import { MdMultilineChart, MdAddChart } from "react-icons/md";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import { CiMoneyBill } from "react-icons/ci";
import { TbRefresh } from "react-icons/tb"; 
import StatCard from "../h/StatCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Claims = ({ userData }) => {
  const [closeModal, setCloseModal] = useState(false)
  const [closePayModal, setClosePayModal] = useState(false)
  const [claimsData, setClaimsData] = useState([])
  const [refresh, setRefresh] = useState(0)
  const navigate = useNavigate();
  // Notification states
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "" // success, error, info
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [dashbordInfor, setDashbordInfor] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        claimed: 0,
        member: 0,
  })
  
  const [data, setData] = useState(
    {
      benefit: "",
      pin : ""
    }
  )
  
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }
  
  const viewApplication = (appId, pin) => {
    navigate(`/view/${appId}/${pin}`);
  };
  
    useEffect(() => {  
     if (userData.status == "admin") {
      Promise.all([
      axios.get(`${import.meta.env.VITE_HOST}/admin/get-all-applications/status/Pending`),
      axios.get(`${import.meta.env.VITE_HOST}/admin/get-all-applications/status/Rejected`),
      axios.get(`${import.meta.env.VITE_HOST}/admin/get-all-applications/status/Claimed`),
      axios.get(`${import.meta.env.VITE_HOST}/admin/get-all-applications/status/Approved`),
      axios.get(`${import.meta.env.VITE_HOST}/admin/get-all-applications`),
      axios.get(`${import.meta.env.VITE_HOST}/admin/get-all-members`),
    ]).then(res => {
      setDashbordInfor({
        total : res[4].data.data.length,
        pending : res[0].data.data.length,
        rejected : res[1].data.data.length,
        claimed : res[2].data.data.length,
        approved: res[3].data.data.length,
        member: res[5].data.data.length
      })
      setClaimsData(res[4].data.data)
    })
    } else {
      Promise.all([
      axios.get(`${import.meta.env.VITE_HOST}/admin/get-all-applications/Pending/${userData.memberpin}/${userData.fname}`),
      axios.get(`${import.meta.env.VITE_HOST}/admin/get-all-applications/Rejected/${userData.memberpin}/${userData.fname}`),
      axios.get(`${import.meta.env.VITE_HOST}/admin/get-all-applications/Claimed/${userData.memberpin}/${userData.fname}`),
      axios.get(`${import.meta.env.VITE_HOST}/admin/get-all-applications/Approved/${userData.memberpin}/${userData.fname}`),
      axios.get(`${import.meta.env.VITE_HOST}/admin/get-all-applications-by-member/${userData.memberpin}`),
      ]).then(res => {
      setDashbordInfor({
        total : res[4].data.data.length,
        pending : res[0].data.data.length,
        rejected : res[1].data.data.length,
        claimed : res[2].data.data.length,
        approved: res[3].data.data.length,
      })
      setClaimsData(res[4].data.data)
    })
    }
    }, [refresh,userData])
  
  const handleVerifyUserClaims = (e) => {
    e.preventDefault()
    axios
      .get(`${import.meta.env.VITE_HOST}/admin/verify-user-claim/${data.pin}/${data.benefit}`)
      .then((res) => {

        if (res.data.data.length == 0) {
          showNotification(`${data.benefit} benefit has not been applied for yet`, "error")
        } else {
          showNotification(`${data.benefit} benefit has been ${res.data.data[0].status}`, "info")
        }
        setCloseModal(false)
      })
      .catch((err) => {
        showNotification(err.response?.data?.message || "Error verifying claim", "error")
      }).finally(() =>setData({
      benefit: "",
      pin : ""
    }))
  }
  
  const pay = (e) => {
    e.preventDefault()
    axios
      .patch(
        `${import.meta.env.VITE_HOST}/admin/pay-benefit`,
        {
          pin: data.pin,
          benefit: data.benefit,
          approved_by: `${userData.fname} ${userData.lname}`,
        }
      )
      .then(() => {
        showNotification("Payment processed successfully ✔", "success")
        setClosePayModal(false)
      })
      .catch((err) => {
        showNotification(err.response?.data?.message || "Problem processing payment", "error")
      }).finally(() =>setData({
      benefit: "",
      pin : ""
    }))
  }
  
   // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = claimsData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(claimsData.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))
  
  const handleSearch = async (e) => {
           axios
            .get(`${import.meta.env.VITE_HOST}/admin/get-all-applications/memberpin/${e.target.value}`).then(response => setClaimsData(response.data.data))
  }
  
  const handleButtonClick = (id, status, validated_by) => {
       axios
         .patch(
           `${import.meta.env.VITE_HOST}/admin/update-record/${id}/${status}/${validated_by}`
         )
         .then((res) => {
           showNotification(res.data.message, "success")
           setRefresh(() => refresh + 1)
         })
      .catch((err) => {
        showNotification(err.response?.data?.message || "Error updating record", "error")

      });
    }
    
  return (
    <div className="space-y-4 px-2 sm:px-0 relative">
      {/* Notification Toast */}
      {notification.show && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[100] w-11/12 max-w-md animate-slide-down">
          <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            notification.type === 'success' ? 'bg-green-500' :
            notification.type === 'error' ? 'bg-red-500' :
            'bg-blue-500'
          } text-white`}>
            {notification.type === 'success' && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {notification.type === 'error' && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {notification.type === 'info' && (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}
    
      {/* Verify Claim Modal */}
      {
        closeModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-[#1A1A2E] rounded-md p-5 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-end">
                <IoIosClose className="text-red-500 text-4xl cursor-pointer" onClick={() => setCloseModal(false)} />
              </div>
              <form onSubmit={handleVerifyUserClaims}>
                <div className="flex flex-col gap-4 items-center pt-5" >  
                  <p className="font-bold text-white text-lg md:text-xl text-center">Verify if payments has already been made</p>
                  <input 
                    type="text" 
                    name="pin" 
                    className="w-full md:w-3/4 p-2 rounded border border-gray-600 bg-transparent text-white" 
                    placeholder="Enter Pin Here"
                    value={data.pin}
                    onChange={(e) => setData({ pin: e.target.value, benefit: data.benefit })}
                    required
                  />
                  <select 
                    name=""
                    id="benefit" 
                    className="w-full md:w-3/4 p-2 rounded text-sm border border-gray-600 bg-[#1A1A2E] text-white"
                    value={data.benefit}
                    onChange={(e) => setData({ benefit: e.target.value, pin: data.pin })}
                    required
                  >
                    <option value="">Select benefit</option>
                    <option value="death of spouse">Death of spouse</option>
                    <option value="death of child">Death of Child</option>
                    <option value="death of member">Death of Member</option>
                    <option value="marriage">Wedding/Marriage</option>
                    <option value="hospitalization">Hospitalization</option>
                    <option value="retirement">Retirement</option>
                    <option value="release">Release</option>
                    <option value="death of parent">Death of Parent</option>
                    <option value="disaster">Disaster</option>
                    <option value="wrongful deduction">Wrongful Deduction</option>
                  </select>
                  <input type="submit" value="Verify" className="w-full md:w-3/4 bg-[#BBF7D0] text-black font-bold py-2 rounded cursor-pointer hover:bg-green-300 transition-colors" />
                </div>
              </form>
            </div>
          </div>
        )
      } 
      
      {/* Process Payment Modal */}
      {
        closePayModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-[#1A1A2E] rounded-md p-5 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-end">
                <IoIosClose className="text-red-500 text-4xl cursor-pointer" onClick={() => setClosePayModal(false)} />
              </div>
              <form onSubmit={pay}>
                <div className="flex flex-col gap-4 items-center pt-5" >  
                  <p className="font-bold text-white text-lg md:text-xl text-center">Make Payments</p>
                  <input
                    type="text"
                    name="pin"
                    className="w-full md:w-3/4 p-2 rounded border border-gray-600 bg-transparent text-white"
                    placeholder="Enter Pin Here"
                    value={data.pin}
                    onChange={(e) => setData({ pin: e.target.value, benefit: data.benefit })}
                    required
                  />
                  <select
                    name=""
                    id="benefit"
                    className="w-full md:w-3/4 p-2 rounded text-sm border border-gray-600 bg-[#1A1A2E] text-white"
                    value={data.benefit}
                    onChange={(e) => setData({ benefit: e.target.value, pin: data.pin })}
                    required
                  >
                    <option value="">Select benefit</option>
                    <option value="death of spouse">Death of spouse</option>
                    <option value="death of child">Death of Child</option>
                    <option value="death of member">Death of Member</option>
                    <option value="marriage">Wedding/Marriage</option>
                    <option value="hospitalization">Hospitalization</option>
                    <option value="retirement">Retirement</option>
                    <option value="release">Release</option>
                    <option value="death of parent">Death of Parent</option>
                    <option value="disaster">Disaster</option>
                    <option value="wrongful deduction">Wrongful Deduction</option>
                  </select>
                  <input type="submit" value="Pay Now" className="w-full md:w-3/4 bg-[#BBF7D0] text-black font-bold py-2 rounded cursor-pointer hover:bg-green-300 transition-colors" />
                </div>
              </form>
            </div>
          </div>
        )
      }
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <p>
            <span className="font-bold text-xl sm:text-2xl">Dashboard</span>{" "}
            <span className="text-xs sm:text-sm font-bold text-[#54A3E2]">/ Claims</span>
          </p>
          <p className="text-xs text-[#AAAAAA]">welcome back, {userData.fname}</p>
        </div>
        <span className="text-xs text-[#AAAAAA]">
          {new Date().toDateString()}
        </span>
      </div>

      {/* Stats */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
          <StatCard
            icon={<MdAddChart className="text-xl md:text-2xl text-red-400" />}
            title={userData.status == "admin" ? "Total Members" : "Total Applications"}
            value={userData.status == "admin" ? dashbordInfor.member : dashbordInfor.total}
            subtitle="members till date"
          />
          <StatCard
            icon={<BiDoughnutChart className="text-xl md:text-2xl text-red-400" />}
            title={userData.status == "admin" ? "Total Applications" : "Rejected Applications"}
            value={userData.status == "admin" ? dashbordInfor.total : dashbordInfor.rejected}
            subtitle="total applications"
          />
        </div>

        <div className="w-full space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <StatCard
              icon={<HiOutlineDotsCircleHorizontal className="text-xl md:text-2xl text-red-400" />}
              title="Pending Applications"
              value={dashbordInfor.pending}
              subtitle="pending applications"
            />
            <StatCard
              icon={<MdMultilineChart className="text-xl md:text-2xl text-red-400" />}
              title="Approved Applications"
              value={dashbordInfor.approved}
              subtitle="approved applications"
            />
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button 
          disabled={userData.status !== "admin"} 
          className="bg-[#E4E6F4] disabled:cursor-not-allowed disabled:opacity-50 p-2 rounded-md text-[#AAAAAA] text-sm w-full sm:w-auto hover:bg-[#d0d2e0] transition-colors" 
          onClick={() => setCloseModal(true)}
        >
          Verify Claim
        </button>
        <button 
          disabled={userData.status !== "admin"} 
          className="bg-[#E4E6F4] disabled:cursor-not-allowed disabled:opacity-50 p-2 rounded-md text-[#AAAAAA] text-sm w-full sm:w-auto hover:bg-[#d0d2e0] transition-colors" 
          onClick={() => setClosePayModal(true)}
        >
          Process Claims
        </button>
      </div>
      
      {/* Members Table */}
      <div className="min-h-72 py-3 px-2 sm:px-3 bg-[#FBFBFB] rounded-md overflow-hidden">
        <p className="font-bold text-base sm:text-lg">All Benefits Applications</p>

        {
          userData.status == "admin" && (
            <div className="flex flex-col sm:flex-row justify-between mt-3 items-start sm:items-center gap-3">
              <div className="w-full sm:w-4/5">
                <div className="relative w-full sm:w-2/5">
                  <input
                    type="search"
                    placeholder="Search by PIN"
                    onChange={(e) => handleSearch(e)}
                    className="bg-[#F6F6FB] p-2 w-full rounded-lg pl-9 text-[#6B7280] outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B2BEC6]" />
                </div>
              </div>
              <button 
                className="flex justify-center text-white bg-[#0DAAFF] items-center px-4 py-2 rounded-md gap-2 w-full sm:w-auto hover:bg-blue-600 transition-colors" 
                onClick={() => setRefresh(refresh + 1 )}
              >
                <TbRefresh /> Refresh
              </button>
            </div>
          )
        }

        {/* Scrollable table */}
        <div className="overflow-x-auto mt-4">
          <div className="min-w-[600px] md:min-w-[900px]">
            <div className="grid grid-cols-12 text-xs md:text-sm font-bold text-gray-500 border-b pb-2">
              <div className="col-span-2">Pin</div>
              <div className="col-span-3">Name</div>
              <div className="col-span-3">Benefit</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Action</div>
            </div>

            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 mt-3 text-xs md:text-sm items-center border-b pb-2 hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-2 truncate pr-1">{item.memberpin}</div>
                  <div className="col-span-3 font-medium truncate pr-1">{item.fname} {item.lname}</div>
                  <div className="col-span-3 text-gray-500 truncate pr-1">
                    {item.benefit}
                  </div>
                  <div className="col-span-2">
                    <span className={`
                      inline-block px-2 py-1 rounded-full text-xs font-medium
                      ${item.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                        item.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                        item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}
                    `}>
                      {item.status}
                    </span>
                  </div>
                  <div className="col-span-2 flex gap-2 items-center">
                    {
                      userData.status == "admin" && (
                        <>
                          <button
                            className="disabled:cursor-not-allowed disabled:opacity-50 p-1 hover:bg-red-50 rounded-full transition-colors"
                            disabled={item.status != "Pending"}
                            onClick={() => handleButtonClick(item.id, "Rejected", `solo`)}
                            title="Reject"
                          >
                            <IoIosClose className="text-2xl text-red-500" />
                          </button>
                          <button 
                            className="disabled:cursor-not-allowed disabled:opacity-50 p-1 hover:bg-green-50 rounded-full transition-colors" 
                            disabled={item.status != "Pending"} 
                            onClick={() => handleButtonClick(item.id, "Approved", `solo`)}
                            title="Approve"
                          >
                            <GrFormCheckmark className="text-2xl text-green-500" />
                          </button>
                        </>
                      )
                    }
                    <button 
                      onClick={() => viewApplication(item.id, item.memberpin)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      title="View Details"
                    >
                      <FaRegEye className="text-xl text-gray-500" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 col-span-12">
                No claims data available
              </div>
            )}
            
            {/* Pagination Controls */}
            {claimsData.length > 0 && (
              <>
                <div className="flex flex-wrap justify-end items-center gap-2 mt-4 pt-2 border-t">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-[#0DAAFF] text-white hover:bg-blue-600'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded ${
                          currentPage === number
                            ? 'bg-[#0DAAFF] text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-[#0DAAFF] text-white hover:bg-blue-600'
                    }`}
                  >
                    Next
                  </button>
                </div>
                
                {/* Showing items info */}
                <div className="text-xs md:text-sm text-gray-500 mt-2 text-right">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, claimsData.length)} of {claimsData.length} entries
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
 
    </div>
  );
};

export default Claims;