import { useState, useEffect } from "react";
import { IoIosClose } from "react-icons/io"; 
import {  BiSearch, BiDoughnutChart } from "react-icons/bi";
import { FaRegEye } from "react-icons/fa"; 
import { MdMultilineChart, MdAddChart } from "react-icons/md";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import { TbRefresh } from "react-icons/tb"; 
import StatCard from "../h/StatCard";
import axios from "axios";

const Register = ({userData}) => {
  const [data, setData] = useState([])
  const [refresh, setRefresh] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [deleting, setDeleting] = useState(false)
  const [submitting,setSubmitting] = useState(false)
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
    
  useEffect(() => {  
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
      setData(res[5].data.data)
    })
  }, [refresh])
  
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }
  
  const [userModal, setUserModal] = useState(false)
  const [adminModal, setadminModal] = useState(false)
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
    
   const handleAddMemberForm = (e) => {
     e.preventDefault();
     setSubmitting(true)
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
      setTimeout(() => {
        setUserModal(false)
      }, 1000);
      setSubmitting(false)
    })
  };
  
  const addAdmin = (e) => {
    e.preventDefault()
    setSubmitting(true)
    axios
      .post(`${import.meta.env.VITE_HOST}/admin/register-admin`, infor, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
      })
      .then(() => {
        showNotification('Admin has been saved successfully', 'success')
      })
      .catch((err) => {
        showNotification(err.response?.data?.error || err.response?.data?.message || 'Error saving admin', 'error')
      }).finally(() => {
        setTimeout(() => {
        setadminModal(false)
        }, 1000);
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
        setSubmitting(false)
      })
  }
  
   const deleteMember = (id) => {
     if (window.confirm("Are you sure you want to delete this member?")) {
      setDeleting(true)
      axios
        .delete(`${import.meta.env.VITE_HOST}/admin/delete-member/${id}`)
        .then(() => {
          setRefresh(refresh + 1)
          showNotification('Member deleted successfully', 'success')
        })
        .catch((err) => {
          showNotification('Error deleting member', 'error')
        })
        .finally(() => setDeleting(false))
    }
  }
  
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(data.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))

  const handleSearch = async (e) => {
    axios
      .get(`${import.meta.env.VITE_HOST}/admin/get-member/${e.target.value}`)
      .then(response => setData(response.data.data))
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
    
      {/* User Modal */}
      {userModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-[#1A1A2E] rounded-md p-5 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleAddMemberForm}>
              <div className="flex justify-end">
                <IoIosClose className="text-red-600 text-3xl cursor-pointer" onClick={() => {
                  setUserModal(false)
                  setInfor(
                  {
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
                }} />
              </div>
              <p className="text-white font-bold text-lg mb-4">Register New User</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="Enter First Name here"
                  value={infor.fname}
                  onChange={(e) => setInfor({...infor, fname: e.target.value})}
                  className="p-2 w-full border rounded"
                  required
                />
                <input 
                  type="text"
                  placeholder="Enter Other Names here"
                  value={infor.lname}
                  onChange={(e) => setInfor({...infor, lname: e.target.value})}
                  className="p-2 w-full border rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <input 
                  type="email" 
                  placeholder="Enter Email here"
                  value={infor.email}
                  onChange={(e) => setInfor({...infor, email: e.target.value})}
                  className="p-2 w-full border rounded"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Enter Address here"
                  value={infor.address}
                  onChange={(e) => setInfor({...infor, address: e.target.value})}
                  className="p-2 w-full border rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <input 
                  type="text" 
                  placeholder="Enter Member's pin here"
                  value={infor.memberpin}
                  onChange={(e) => setInfor({...infor, memberpin: e.target.value})}
                  className="p-2 w-full border rounded"
                  required
                />
                <input 
                  type="date" 
                  placeholder="Enter Date of Birth here"
                  value={infor.dob}
                  onChange={(e) => setInfor({...infor, dob: e.target.value})}
                  className="p-2 w-full border rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <input 
                  type="text" 
                  placeholder="Assign School"
                  value={infor.school}
                  onChange={(e) => setInfor({...infor, school: e.target.value})}
                  className="p-2 w-full border rounded"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Member's Contact"
                  value={infor.number}
                  onChange={(e) => setInfor({...infor, number: e.target.value})}
                  className="p-2 w-full border rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <input 
                  type="file"  
                  onChange={(e) => setInfor({...infor, img: e.target.files[0]})}
                  className="p-2 w-full border rounded"
                  required
                />
                <select 
                  value={infor.gender}
                  onChange={(e) => setInfor({...infor, gender: e.target.value})}
                  className="p-2 w-full border rounded"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-2 mt-5">
                <button onClick={() => setInfor(
                  {
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
                  }
                )} type="reset" className="bg-red-500 w-full sm:w-40 py-2 rounded-md font-bold text-white hover:bg-red-600 transition-colors">
                  Clear
                </button>
                <button type="submit" disabled = {submitting}  className="bg-green-500 w-full sm:w-40 py-2 disabled:cursor-not-allowed rounded-md font-bold text-white hover:bg-green-600 transition-colors">
                  {
                    submitting ? "Submitting" : "Submit"
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Admin Modal */}
      {adminModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-[#1A1A2E] rounded-md p-5 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={addAdmin}>
              <div className="flex justify-end">
                <IoIosClose className="text-red-600 text-3xl cursor-pointer" onClick={() => {
                  setadminModal(false)
                   setInfor(
                  {
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
                }} />
              </div>
              <p className="text-white font-bold text-lg mb-4">Register New Administrator</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="Enter First Name here"
                  value={infor.fname}
                  onChange={(e) => setInfor({...infor, fname: e.target.value})}
                  className="p-2 w-full border rounded"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Enter Other Names here"
                  value={infor.lname}
                  onChange={(e) => setInfor({...infor, lname: e.target.value})}
                  className="p-2 w-full border rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <input 
                  type="email" 
                  placeholder="Enter Email here"
                  value={infor.email}
                  onChange={(e) => setInfor({...infor, email: e.target.value})}
                  className="p-2 w-full border rounded"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Enter Member's pin here"
                  value={infor.memberpin}
                  onChange={(e) => setInfor({...infor, memberpin: e.target.value})}
                  className="p-2 w-full border rounded"              
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <input 
                  type="text" 
                  placeholder="Assign School"
                  value={infor.school}
                  onChange={(e) => setInfor({...infor, school: e.target.value})}
                  className="p-2 w-full border rounded"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Member's Contact"
                  value={infor.number}
                  onChange={(e) => setInfor({...infor, number: e.target.value})}
                  className="p-2 w-full border rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <input 
                  type="file"
                  onChange={(e) => setInfor({...infor, img: e.target.files[0]})}
                  className="p-2 w-full border rounded"
                  required
                />
                <select 
                  value={infor.gender}
                  onChange={(e) => setInfor({...infor, gender: e.target.value})}
                  className="p-2 w-full border rounded"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-2 mt-5">
                <button  onClick={() => setInfor(
                  {
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
                  }
                )} type="reset" className="bg-red-500 w-full sm:w-40 py-2 rounded-md font-bold text-white hover:bg-red-600 transition-colors">
                  Clear
                </button>
                <button type="submit" disabled = {submitting}  className="bg-green-500 w-full sm:w-40 py-2 rounded-md font-bold text-white hover:bg-green-600 transition-colors">
                 {
                  submitting ? "Submitting" : "Submit"
                 }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <p>
            <span className="font-bold text-xl sm:text-2xl">Dashboard</span>{" "}
            <span className="text-xs sm:text-sm font-bold text-[#54A3E2]">/ register</span>
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
            icon={<MdAddChart className="text-xl sm:text-2xl text-red-400" />}
            title="Total Members"
            value={dashbordInfor.member}
            subtitle="members till date"
          />
          <StatCard
            icon={<BiDoughnutChart className="text-xl sm:text-2xl text-red-400" />}
            title="Total Applications"
            value={dashbordInfor.total}
            subtitle="total applications"
          />
        </div>

        <div className="w-full space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <StatCard
              icon={<HiOutlineDotsCircleHorizontal className="text-xl sm:text-2xl text-red-400" />}
              title="Pending Applications"
              value={dashbordInfor.pending}
              subtitle="pending applications"
            />
            <StatCard
              icon={<MdMultilineChart className="text-xl sm:text-2xl text-red-400" />}
              title="Approved Applications"
              value={dashbordInfor.approved}
              subtitle="approved applications"
            />
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        <button className="bg-[#E4E6F4] p-2 rounded-md text-[#AAAAAA] text-sm w-full sm:w-auto hover:bg-[#d0d2e0] transition-colors" onClick={() => setUserModal(true)}>
          Register New Member
        </button>
        <button className="bg-[#E4E6F4] p-2 rounded-md text-[#AAAAAA] text-sm w-full sm:w-auto hover:bg-[#d0d2e0] transition-colors" onClick={() => setadminModal(true)}>
          Register New Administrator
        </button>
      </div>
      
      {/* Members Table */}
      <div className="min-h-72 py-3 px-3 bg-[#FBFBFB] rounded-md overflow-hidden">
        <p className="font-bold text-base sm:text-lg">All Active Members</p>

        <div className="flex flex-col sm:flex-row justify-between mt-3 items-start sm:items-center gap-3">
          <div className="w-full sm:w-4/5">
            <div className="relative w-full sm:w-2/5">
              <input
                type="search"
                placeholder="Search"
                onChange={(e) => handleSearch(e)}
                className="bg-[#F6F6FB] p-2 w-full rounded-lg pl-9 text-[#6B7280] outline-none focus:ring-2 focus:ring-blue-200"
              />
              <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B2BEC6]" />
            </div>
          </div>
          <button className="flex justify-center text-white bg-[#0DAAFF] items-center px-4 py-2 rounded-md gap-2 w-full sm:w-auto hover:bg-blue-600 transition-colors" onClick={() => setRefresh(refresh + 1)}>
            <TbRefresh /> Refresh
          </button>
        </div>

        {/* Scrollable table */}
        <div className="overflow-x-auto mt-4">
          <div className="min-w-[600px] sm:min-w-[900px]">
            <div className="grid grid-cols-12 text-xs sm:text-sm font-bold text-gray-500 border-b pb-2">
              <div className="col-span-2">Pin</div>
              <div className="col-span-3">Name</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2">Phone No</div>
              <div className="col-span-2">Action</div>
            </div>

            {currentItems.map((member) => (
              <div
                key={member.id}
                className="grid grid-cols-12 mt-3 text-xs sm:text-sm items-center border-b pb-2 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-2 truncate">{member.memberpin}</div>
                <div className="col-span-3 font-medium truncate">{member.fname} {member.lname}</div>
                <div className="col-span-3 text-gray-500 truncate">
                  {member.email}
                </div>
                <div className="col-span-2 truncate">{member.number}</div>
                <div className="col-span-2 flex items-center gap-2 sm:gap-4">
                  <button
                    disabled = {deleting}
                    onClick={() => deleteMember(member.memberpin)}
                    className="disabled:cursor-not-allowed hover:bg-red-50 p-1 rounded-full transition-colors"
                    title="Delete Member"
                  >
                    {deleting ? "deleting" : <IoIosClose className="text-xl sm:text-2xl text-red-500" />}
                  </button>
                  <a className="hover:bg-gray-100 p-1 rounded-full transition-colors cursor-pointer" title="View Details">
                    <FaRegEye className="text-lg sm:text-xl text-gray-500" />
                  </a>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {data.length > 0 && (
              <>
                <div className="flex flex-wrap justify-end items-center gap-2 mt-4 pt-2 border-t">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${
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
                        className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${
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
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-[#0DAAFF] text-white hover:bg-blue-600'
                    }`}
                  >
                    Next
                  </button>
                </div>
                
                {/* Showing items info */}
                <div className="text-xs sm:text-sm text-gray-500 mt-2 text-right">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, data.length)} of {data.length} entries
                </div>
              </>
            )}
            
            {data.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No members found
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Register;