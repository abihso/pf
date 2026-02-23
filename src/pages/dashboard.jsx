import { TbRefresh } from "react-icons/tb"; 
import React, { useState,useEffect } from "react";
import { BiPlus, BiSearch, BiDoughnutChart } from "react-icons/bi";
import { RiUpload2Line, RiMenuAddLine } from "react-icons/ri";
import { IoMdSend } from "react-icons/io";
import { AiTwotoneSetting, AiOutlineArrowUp } from "react-icons/ai";
import { MdMultilineChart, MdAddChart } from "react-icons/md";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import { CiMoneyBill } from "react-icons/ci";
import StatCard from "../h/StatCard";
import { IoIosClose } from "react-icons/io"; 
import axios from "axios";

const Dashboard = ({ setHomePage, userData }) => {

  const [data, setData] = useState([])
      const [refresh,setRefresh] = useState(0)
      
      // Notification states
      const [notification, setNotification] = useState({
        show: false,
        message: "",
        type: "" // success, error, info
      })
      
      const [dashbordInfor, setDashbordInfor] = useState({
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          claimed: 0,
          member: 0,
        })
        
      // Pagination states
      const [currentPage, setCurrentPage] = useState(1)
      const [itemsPerPage] = useState(5) // Show 5 items per page
      
      const showNotification = (message, type) => {
        setNotification({ show: true, message, type })
        setTimeout(() => {
          setNotification({ show: false, message: "", type: "" })
        }, 3000)
      }
      
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
    })
    } else {
      Promise.all([
      axios.get(`${import.meta.env.VITE_HOST}/admin/get-all-applications/Pending/${userData.memberpin}/${userData.fname}`),

      axios.get(`${import.meta.env.VITE_HOST}/admin/get-all-applications/Rejected/${userData.memberpin}/${userData.fname}`),

      axios.get(`${import.meta.env.VITE_HOST}/admin/get-all-applications/Claimed/${userData.memberpin}/${userData.fname}`),

      axios.get(`${import.meta.env.VITE_HOST}/admin/get-all-applications/Approved/${userData.memberpin}/${userData.fname}`),

      axios.get(`${import.meta.env.VITE_HOST}/admin/get-specific-application-by-members/${userData.memberpin}`),

      ]).then(res => {
      setDashbordInfor({
        total : res[4].data.data.length,
        pending : res[0].data.data.length,
        rejected : res[1].data.data.length,
        claimed : res[2].data.data.length,
        approved: res[3].data.data.length,
      })
    })
    }
  }, [userData])
     
  
   
    const [infor, setInfor] = useState({
            fname:"",
            lname:"",
            address:"",
            school:"",
            dob:"",
            gender:"",
            email:"",
            number:"",
            img:null,
            password:"",
            memberpin:"",
     })
     
    const [message, setMessage] = useState({
        title: "",
        message : "",
        by : ""
     })
    const [closeModal, setCloseModal] = useState(false)
    const [userModal, setUserModal] = useState(false)
    
   const handleAddMemberForm = (e) => {
    e.preventDefault();
    axios.post(`${import.meta.env.VITE_HOST}/admin/register-member`, infor, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then(() => {
      showNotification('User saved successfully', 'success')
    }).catch(err => {
     if (err.response?.data?.code == "SQLITE_CONSTRAINT_UNIQUE") {
       showNotification('User already exists', 'error')
     } else {
       showNotification('Problem saving user', 'error')
     }
    }).finally(() => {
      setRefresh(refresh + 1)
      setInfor({
        fname:"",
        lname:"",
        address:"",
        school:"",
        dob:"",
        gender:"",
        email:"",
        number:"",
        img:null,
        password:"",
        memberpin:"",
    })
    })
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(data.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))



  //////////////////////////////////
    const handdleSubmit = (e) => {
      e.preventDefault()
      if(message.title.length < 1 || message.message.length < 1) {
        showNotification("No message was typed", "error")
        return
      }
      axios
        .post(`${import.meta.env.VITE_HOST}/admin/send-message`, {...message,by : "office"})
        .then((res) => {
          showNotification(res.data.message, "success")
          setCloseModal(false)
          setMessage({ title: "", message: "", by: "" })
        })
        .catch((err) => {
          showNotification(err.response?.data?.message || "Error sending message", "error")
        });
    }
    
    useEffect(() => {
        if (userData.status == "admin") {
          axios
          .get(`${import.meta.env.VITE_HOST}/admin/get-all-members`)
          .then((res) => {
            setData(res.data.data)
          })
          .catch((err) => console.log(err));
        } else {
          axios
          .get(`${import.meta.env.VITE_HOST}/admin/get-all-applications-by-member/${userData.memberpin}`)
          .then((res) => {
            setData(res.data.data)
          })
          .catch((err) => console.log(err));
        }
    }, [refresh, userData])
    
    const handleSearch = async (e) => {
        axios
        .get(`${import.meta.env.VITE_HOST}/admin/get-member/${e.target.value}`).then(response => setData(response.data.data))
      }
      
  return (
    <div className="space-y-4 px-2 md:px-0 relative">
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
    
      {/* Message Modal */}
      {closeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-[#1A1A2E] rounded-md p-5 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end">
              <IoIosClose className="text-red-500 text-4xl cursor-pointer" onClick={() => setCloseModal(false)} />
            </div>
            <form onSubmit={handdleSubmit}>
              <div className="flex flex-col gap-3 items-center pt-5" >  
                <p className="font-bold text-white text-xl" >Send Message</p>
                <input 
                  type="text" 
                  value={message.title} 
                  onChange={(e) => setMessage({...message, title: e.target.value})} 
                  className="w-full md:w-3/4 text-center p-2 rounded" 
                  placeholder="Title" 
                  required
                />
                <textarea 
                  value={message.message} 
                  onChange={(e) => setMessage({...message, message: e.target.value})}  
                  className="w-full md:w-3/4 text-center min-h-48 max-h-52 p-2 rounded" 
                  placeholder="Message" 
                  required
                />
                <input 
                  type="submit" 
                  value="Send" 
                  className="w-full md:w-3/4 bg-[#BBF7D0] text-black font-bold py-2 rounded cursor-pointer hover:bg-green-300 transition-colors" 
                />
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        {/* User Modal */}
        {userModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
            <div className="bg-[#1A1A2E] rounded-md p-5 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <form onSubmit={handleAddMemberForm} >
                <div className="flex justify-end" >
                  <IoIosClose className="text-red-600 text-2xl cursor-pointer" onClick={() => setUserModal(false)} />
                </div>
                <p className="text-white font-bold text-lg mb-4" >Register New User</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3" >
                  <input 
                    type="text" 
                    placeholder="Enter First Name here"
                    value={infor.fname}
                    onChange={(e) => setInfor({...infor,fname:e.target.value})}
                    className="p-2 rounded w-full border border-gray-600"
                    required
                  />
                  <input type="text"
                    placeholder="Enter Other Names here"
                    value={infor.lname}
                    onChange={(e) => setInfor({...infor,lname:e.target.value})}
                    className="p-2 rounded w-full border border-gray-600"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3" >
                  <input 
                    type="email" 
                    placeholder="Enter Email here"
                    value={infor.email}
                    onChange={(e) => setInfor({...infor,email:e.target.value})}
                    className="p-2 rounded w-full border border-gray-600"
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Enter Address here"
                    value={infor.address}
                    onChange={(e) => setInfor({...infor,address:e.target.value})}
                    className="p-2 rounded w-full border border-gray-600"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3" >
                  <input 
                    type="text" 
                    placeholder="Enter Member's pin here"
                    value={infor.memberpin}
                    onChange={(e) => setInfor({...infor,memberpin:e.target.value})}
                    className="p-2 rounded w-full border border-gray-600"
                    required
                  />
                  <input 
                    type="date" 
                    placeholder="Enter Date of Birth here"
                    value={infor.dob}
                    onChange={(e) => setInfor({...infor,dob:e.target.value})}
                    className="p-2 rounded w-full border border-gray-600"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3" >
                  <input 
                    type="text" 
                    placeholder="Assign School"
                    value={infor.school}
                    onChange={(e) => setInfor({...infor,school:e.target.value})}
                    className="p-2 rounded w-full border border-gray-600"
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Member's Contact"
                    value={infor.number}
                    onChange={(e) => setInfor({...infor,number:e.target.value})}
                    className="p-2 rounded w-full border border-gray-600"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3" >
                  <input 
                    type="file"  
                    onChange={(e) => setInfor({...infor,img:e.target.files[0]})}
                    className="p-2 rounded w-full bg-white border border-gray-600"
                    required
                  />
                  <select 
                    value={infor.gender}
                    onChange={(e) => setInfor({...infor,gender:e.target.value})}
                    className="p-2 rounded w-full border border-gray-600"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-2 mt-5" >
                  <button type="reset" className="bg-red-500 w-full sm:w-40 py-2 rounded-md font-bold text-white hover:bg-red-600 transition-colors" >Clear</button>
                  <button type="submit" className="bg-green-500 w-full sm:w-40 py-2 rounded-md font-bold text-white hover:bg-green-600 transition-colors" >Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        <div>
          <p>
            <span className="font-bold text-xl md:text-2xl">Dashboard</span>{" "}
            <span className="text-xs md:text-sm font-bold text-[#54A3E2]">/ Overview</span>
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
          {
            userData.status == "admin" && (
              <StatCard
                icon={<MdAddChart className="text-xl md:text-2xl text-red-400" />}
                title="Total Members"
                value={dashbordInfor.member}
                subtitle="members till date"
              />
            )
          }
          <StatCard
            icon={<BiDoughnutChart className="text-xl md:text-2xl text-red-400" />}
            title="Total Applications"
            value={dashbordInfor.total}
            subtitle="total applications"
          />
          <StatCard
            icon={<RiMenuAddLine className="text-xl md:text-2xl text-red-400" />}
            title="Rejected Applications"
            value={dashbordInfor.rejected}
            subtitle="rejected claims"
          />
          <StatCard
            icon={<CiMoneyBill className="text-xl md:text-2xl text-red-400" />}
            title="Paid Applicants"
            value={dashbordInfor.claimed}
            subtitle="paid claims"
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

          {/* Quick Actions */}
          <div className="w-full rounded-md bg-[#FBFBFB] py-2 px-3">
            <p className="text-sm font-bold text-[#AAAAAA]">Quick actions</p>
            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
              <button onClick={() => setHomePage("Settings")} className="flex items-center justify-center gap-2 text-green-400 font-bold border w-full py-2 rounded-md text-sm hover:bg-green-50 transition-colors">
                <AiTwotoneSetting /> Settings
              </button>
              <button onClick={() => setCloseModal(true)} disabled={userData.status != "admin"} className="flex items-center justify-center gap-2 disabled:cursor-not-allowed text-blue-400 border-blue-400 font-bold border w-full py-2 rounded-md text-sm hover:bg-blue-50 transition-colors">
                <IoMdSend /> Message
              </button>
              <button onClick={() => setHomePage("Apply")} className="flex items-center justify-center gap-2 text-red-400 font-bold border border-red-400 w-full py-2 rounded-md text-sm hover:bg-red-50 transition-colors">
                <RiUpload2Line /> Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="min-h-72 py-3 px-3 bg-[#FBFBFB] rounded-md overflow-hidden">
        {
          userData.status == "admin" ? <p className="font-bold text-lg">All Active Members</p> : <p className="font-bold text-lg">All Applications</p>
        }

        {
          userData.status == "admin" && (
            <div className="flex flex-col sm:flex-row justify-between mt-3 items-start sm:items-center gap-3">
              <div className="w-full sm:w-4/5">
                <div className="relative w-full sm:w-2/5">
                  <input
                    type="search"
                    onChange={(e) => handleSearch(e)}
                    placeholder="Search by PIN or Name"
                    className="bg-[#F6F6FB] p-2 w-full rounded-lg pl-9 text-[#6B7280] outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B2BEC6]" />
                </div>
              </div>
              <button className="flex justify-center text-white bg-[#0DAAFF] items-center px-4 py-2 rounded-md gap-2 w-full sm:w-auto hover:bg-blue-600 transition-colors" onClick={() => setRefresh(refresh + 1 )}>
                <TbRefresh /> Refresh
              </button>
            </div>
          )
        }

        {/* Scrollable table */}
        {userData.status == "admin" ? (
          <div className="overflow-x-auto mt-4">
            <div className="min-w-[600px] md:min-w-[900px]">
              <div className="grid grid-cols-12 text-xs md:text-sm font-bold text-gray-500 border-b pb-2">
                <div className="col-span-3">Pin</div>
                <div className="col-span-3">Name</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-3">Phone No</div>
              </div>

              {currentItems.length > 0 ? (
                currentItems.map((member) => (
                  <div
                    key={member.id}
                    className="grid grid-cols-12 mt-3 text-xs md:text-sm items-center border-b pb-2 hover:bg-gray-50 transition-colors"
                  >
                    <div className="col-span-3 truncate pr-1">{member.memberpin}</div>
                    <div className="col-span-3 font-medium truncate pr-1">{member.fname} {member.lname}</div>
                    <div className="col-span-3 text-gray-500 truncate pr-1">
                      {member.email}
                    </div>
                    <div className="col-span-3 truncate">{member.number}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 col-span-12">
                  No members found
                </div>
              )}

              {/* Pagination Controls */}
              {data.length > 0 && (
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
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, data.length)} of {data.length} entries
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <div className="min-w-[600px] md:min-w-[900px]">
              <div className="grid grid-cols-12 text-xs md:text-sm font-bold text-gray-500 border-b pb-2">
                <div className="col-span-1">Id</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-3">Benefit</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-3">Approved by</div>
              </div>

              {currentItems.length > 0 ? (
                currentItems.map((application, index) => (
                  <div
                    key={application.id}
                    className="grid grid-cols-12 mt-3 text-xs md:text-sm items-center border-b pb-2 hover:bg-gray-50 transition-colors"
                  >
                    <div className="col-span-1">{index + 1}</div>
                    <div className="col-span-2 font-medium truncate pr-1">{application.date}</div>
                    <div className="col-span-3 text-gray-500 truncate pr-1">
                      {application.benefit}
                    </div>
                    <div className="col-span-3">
                      <button className={`
                        ${application.status == "Rejected" ? `bg-red-500 text-white` : 
                          application.status == "Approved" ? `bg-green-500 text-white` : 
                          `bg-orange-200 text-gray-700`} 
                        px-2 py-1 rounded-full text-xs font-medium w-20 text-center
                      `} disabled>
                        {application.status}
                      </button>
                    </div>
                    <div className="col-span-3 truncate">{application.approved_by || "N/A"}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 col-span-12">
                  No applications found
                </div>
              )}

              {/* Pagination Controls */}
              {data.length > 0 && (
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
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, data.length)} of {data.length} entries
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    
    </div>
  );
};

export default Dashboard;