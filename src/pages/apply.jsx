import { useState } from "react";
import axios from "axios";

const Apply = ({userData,setHomePage}) => {
   // Notification states
   const [notification, setNotification] = useState({
        show: false,
        message: "",
        type: "" // success, error
   })
   
   const [benefit, setBenefit] = useState({
        status : "",
        approved_by : "",
        email : "",
        memberpin : "",
        lname : "",
        fname : "",
        saddress : "",
        address : "",
        date : "",
        benefit : "",
        pschool : "",
        cschool : "",
        applicant_number : "",
        head_number : "",
        HeadteacherName : "",
        oldpayslip : "",
        currentpayslip : "",
        supportdocuments : "",
        supportdocument : "",
   })
   
   const showNotification = (message, type) => {
        setNotification({ show: true, message, type })
        setTimeout(() => {
            setNotification({ show: false, message: "", type: "" })
        }, 3000)
   }
  
   const handleSubmit = async (e) => {
        e.preventDefault();
        
        axios.post(
            `${import.meta.env.VITE_HOST}/admin/process-member-application`, 
            { ...benefit }, 
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        ).then(res => {
            showNotification(res.data.message, "success")
            // Clear form after successful submission
            setBenefit({
                status: "",
                approved_by: "",
                email: "",
                memberpin: "",
                lname: "",
                fname: "",
                saddress: "",
                address: "",
                date: "",
                benefit: "",
                pschool: "",
                cschool: "",
                applicant_number: "",
                head_number: "",
                HeadteacherName: "",
                oldpayslip: "",
                currentpayslip: "",
                supportdocuments: "",
                supportdocument: "",
            })
        }).catch((err) => {
          console.log(err)
            showNotification(err.response?.data?.message || "Error submitting application", "error")
        })
   };
  
  return (
    <div className="space-y-4 mb-10 px-2 sm:px-0 relative">
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
            <span className="text-xs sm:text-sm font-bold text-[#54A3E2]">/ Apply</span>
          </p>
          <p className="text-xs text-[#AAAAAA]">welcome back, {userData.fname}</p>
        </div>
        <span className="text-xs text-[#AAAAAA]">
          {new Date().toDateString()}
        </span>
      </div>
      
      <div className="border border-[#AAAA] p-2 sm:p-3 rounded-md">
        <form onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div className="bg-[#FBFBFB] border rounded-md py-3 px-3 sm:px-4">
            <p className="font-bold text-sm mb-3">Personal information</p>
            
            {/* Row 1 - First Name and Other Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="w-full">
                <label htmlFor="fname" className="block text-sm font-medium mb-1">First Name</label>
                <input 
                  type="text"
                  placeholder="Enter First Name" 
                  id="fname" 
                  className="p-2 w-full text-sm border-2 rounded bg-transparent disabled:cursor-not-allowed focus:outline-none focus:border-blue-400"
                  value={userData.status == "admin" ? benefit.fname : userData.fname}
                  disabled={userData.status !== "admin"}
                  onChange={e => setBenefit({...benefit, fname: e.target.value})}
                  required   
                />
              </div>
              
              <div className="w-full">
                <label htmlFor="mname" className="block text-sm font-medium mb-1">Other Names</label>
                <input 
                  type="text" 
                  placeholder="Enter Other Names" 
                  id="mname" 
                  className="p-2 w-full text-sm border-2 rounded bg-transparent disabled:cursor-not-allowed focus:outline-none focus:border-blue-400"
                  value={userData.status == "admin" ? benefit.lname : userData.lname}
                  disabled={userData.status !== "admin"}
                  onChange={e => setBenefit({...benefit, lname: e.target.value})}
                  required  
                />
              </div>
            </div>
            
            {/* Row 2 - Date, Phone, Address, Benefit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
              <div className="w-full">
                <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
                <input 
                  type="date"
                  id="date"
                  className="p-2 w-full text-sm border-2 rounded bg-transparent focus:outline-none focus:border-blue-400"
                  value={benefit.date}
                  onChange={e => setBenefit({...benefit, date: e.target.value})}
                  required
                />
              </div>
              
              <div className="w-full">
                <label htmlFor="apn" className="block text-sm font-medium mb-1">Applicant Phone Number</label>
                <input 
                  type="text"
                  placeholder="Enter Applicant Phone Number"
                  id="apn"
                  value={userData.status == "admin" ? benefit.applicant_number : userData.number}
                  disabled={userData.status !== "admin"}
                  onChange={e => setBenefit({...benefit, applicant_number: e.target.value})}
                  required
                  className="p-2 w-full text-sm border-2 rounded bg-transparent disabled:cursor-not-allowed focus:outline-none focus:border-blue-400" 
                />
              </div>
              
              <div className="w-full">
                <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Enter Address"
                  id="address"
                  value={userData.status == "admin" ? benefit.address : userData.address}
                  disabled={userData.status !== "admin"}
                  onChange={e => setBenefit({...benefit, address: e.target.value})}
                  required
                  className="p-2 w-full text-sm border-2 rounded bg-transparent disabled:cursor-not-allowed focus:outline-none focus:border-blue-400" 
                />
              </div>
              
              <div className="w-full">
                <label htmlFor="benefit" className="block text-sm font-medium mb-1">Type of Benefit</label>
                <select 
                  value={benefit.benefit}
                  onChange={(e) => setBenefit({...benefit, benefit: e.target.value})} 
                  id="benefit" 
                  className="p-2 w-full text-sm border-2 rounded bg-transparent focus:outline-none focus:border-blue-400"
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
              </div>
            </div>
            
            {/* Row 3 - Email, Pin, Current School */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
              <div className="w-full">
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter Email here" 
                  id="email" 
                  className="p-2 w-full text-sm border-2 rounded bg-transparent disabled:cursor-not-allowed focus:outline-none focus:border-blue-400"
                  value={userData.status == "admin" ? benefit.email : userData.email}
                  disabled={userData.status !== "admin"}
                  onChange={e => setBenefit({...benefit, email: e.target.value})}
                  required  
                />
              </div>
              
              <div className="w-full">
                <label htmlFor="pin" className="block text-sm font-medium mb-1">Membership Pin</label>
                <input
                  type="text"
                  placeholder="Enter Membership Pin" 
                  id="pin" 
                  className="p-2 w-full text-sm border-2 rounded bg-transparent disabled:cursor-not-allowed focus:outline-none focus:border-blue-400"
                  value={userData.status == "admin" ? benefit.memberpin : userData.memberpin}
                  disabled={userData.status !== "admin"}
                  onChange={e => setBenefit({...benefit, memberpin: e.target.value})}
                  required
                />
              </div>
              
              <div className="w-full">
                <label htmlFor="school" className="block text-sm font-medium mb-1">Current School/Office</label>
                <input
                  type="text"
                  placeholder="Enter data here" 
                  id="school"
                  value={benefit.cschool}
                  onChange={e => setBenefit({...benefit, cschool: e.target.value})}
                  className="p-2 w-full text-sm border-2 rounded bg-transparent focus:outline-none focus:border-blue-400"
                  required
                />
              </div>
            </div>
            
            {/* Row 4 - Headmaster's Phone, Previous School, Headmaster's Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
              <div className="w-full">
                <label htmlFor="hname" className="block text-sm font-medium mb-1">Headmaster's Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter Headmaster's Number" 
                  id="hname" 
                  className="p-2 w-full text-sm border-2 rounded bg-transparent focus:outline-none focus:border-blue-400"
                  value={benefit.head_number}
                  onChange={e => setBenefit({...benefit, head_number: e.target.value})}
                  maxLength={14}
                  required
                />
              </div>
              
              <div className="w-full">
                <label htmlFor="pschool" className="block text-sm font-medium mb-1">Previous School/Office</label>
                <input
                  type="text"
                  value={benefit.pschool}
                  onChange={e => setBenefit({...benefit, pschool: e.target.value})}
                  placeholder="Enter data here" 
                  id="pschool" 
                  className="p-2 w-full text-sm border-2 rounded bg-transparent focus:outline-none focus:border-blue-400"
                  required
                />
              </div>
              
              <div className="w-full">
                <label htmlFor="hpn" className="block text-sm font-medium mb-1">Headmaster's Name</label>
                <input
                  type="text"
                  placeholder="Enter Headmaster's Name"
                  id="hpn"
                  value={benefit.HeadteacherName}
                  onChange={e => setBenefit({...benefit, HeadteacherName: e.target.value})}
                  className="p-2 w-full text-sm border-2 rounded bg-transparent focus:outline-none focus:border-blue-400"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Documents Section */}
          <div className="bg-[#FBFBFB] border rounded-md py-3 px-3 sm:px-4 mt-3">
            <p className="font-bold text-sm mb-3">Documents</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="w-full">
                <label htmlFor="oldpayslip" className="block text-sm font-medium mb-1">Old Pay Slip</label>
                <input
                  type="file"
                  id="oldpayslip"
                  onChange={e => setBenefit({...benefit, oldpayslip: e.target.files[0]})}
                  required
                  className="p-2 w-full text-sm border-2 rounded bg-transparent file:mr-2 file:py-1 file:px-3 file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              
              <div className="w-full">
                <label htmlFor="cp" className="block text-sm font-medium mb-1">Current Pay Slip</label>
                <input
                  type="file"
                  id="cp"
                  className="p-2 w-full text-sm border-2 rounded bg-transparent file:mr-2 file:py-1 file:px-3 file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={e => setBenefit({...benefit, currentpayslip: e.target.files[0]})}
                  required
                />
              </div>
              
              <div className="w-full">
                <label htmlFor="sd" className="block text-sm font-medium mb-1">Supporting Documents</label>
                <input
                  type="file"
                  id="sd"
                  className="p-2 w-full text-sm border-2 rounded bg-transparent file:mr-2 file:py-1 file:px-3 file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={e => setBenefit({...benefit, supportdocuments: e.target.files[0]})}
                  required
                />
              </div>
              
              <div className="w-full">
                <label htmlFor="od" className="block text-sm font-medium mb-1">Other Supporting Documents</label>
                <input
                  type="file"
                  id="od"
                  className="p-2 w-full text-sm border-2 rounded bg-transparent file:mr-2 file:py-1 file:px-3 file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={e => setBenefit({...benefit, supportdocument: e.target.files[0]})}
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Notes Section */}
          <p className="text-xs mt-3">
            <span className="text-red-500 underline">*Note </span>(Attachment to claims)
          </p>
          
          <ul className="text-xs space-y-1 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-3 list-disc pl-4 sm:pl-0">
            <li className="sm:w-full lg:w-auto">1. Release / Retirement letter: One(1) Photocopy(Your 1st deducted payslip) and one most current payslip.</li>
            <li className="sm:w-full lg:w-auto">2. Deaths / Wedding / Marriage: One (1) year old payslip. One most current payslip and one invitation card.</li>
            <li className="sm:w-full lg:w-auto">3. Hospitalization: One (1) year old payslip, One most current payslip, receipts and Doctors report.</li>
            <li className="sm:w-full lg:w-auto">4. Disaster: One (1) year old payslip, One most current payslip, pictures of the scene, NADMO or Police report.</li>
            <li className="sm:w-full lg:w-auto">5. Wrongful / Double Deduction: All affected payslip.</li>
          </ul>
          
          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-end items-end gap-3 bg-[#FBFBFB] border rounded-md py-4 px-3 sm:px-4 mt-3">
            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                type="reset" 
                className="w-full sm:w-24 bg-blue-400 font-bold text-white py-2 rounded-md hover:bg-blue-500 transition-colors"
              >
                Clear
              </button>
              <button 
                type="submit" 
                className="w-full sm:w-24 bg-green-400 font-bold text-white py-2 rounded-md hover:bg-green-500 transition-colors"
              >
                Submit
              </button>
            </div>
            
          </div>
        </form>
      <a onClick={() => setHomePage("Dashboard")} className="text-blue-700 underline cursor-pointer" > Go Back </a>
      </div>     
      <p className="text-xs text-center text-[#AAAA] mt-4">Copyright &copy; 2026-2027 AltBit Softwares</p>
      
      {/* Animation styles */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Apply;