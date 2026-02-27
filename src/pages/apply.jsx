import { useState, useEffect } from "react";
import axios from "axios";

const Apply = ({userData, setHomePage}) => {
   // Notification states
   const [notification, setNotification] = useState({
        show: false,
        message: "",
        type: "" 
   })
   const [submitting,setSubmitting] = useState(false)
   
   const [benefit, setBenefit] = useState({
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
        oldpayslip: null,
        currentpayslip: null,
        supportdocuments: null,
        supportdocument: null,
   });
   
   useEffect(() => {
     if (userData) {
       if (userData.status !== "admin") {
         setBenefit(prev => ({
           ...prev,
           email: userData.email || "",
           memberpin: userData.memberpin || "",
           lname: userData.lname || "",
           fname: userData.fname || "",
           address: userData.address || "",
           applicant_number: userData.number || "",
         }));
       } else {
         setBenefit(prev => ({
           ...prev,
           email: "",
           memberpin: "",
           lname: "",
           fname: "",
           address: "",
           applicant_number: "",
         }));
       }
     }
   }, [userData]);
   
   const showNotification = (message, type) => {
        setNotification({ show: true, message, type })
        setTimeout(() => {
            setNotification({ show: false, message: "", type: "" })
        }, 3000)
   }
  
   const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!benefit.fname || !benefit.lname || !benefit.email || !benefit.memberpin) {
          showNotification("Please fill in all required fields", "error");
          return;
     }
     
        setSubmitting(true)
        // Create FormData object
        const formData = new FormData();
        
        // Append all text fields (only if they have values)
        Object.keys(benefit).forEach(key => {
          if (benefit[key] !== null && benefit[key] !== undefined && 
              key !== 'oldpayslip' && key !== 'currentpayslip' && 
              key !== 'supportdocuments' && key !== 'supportdocument') {
            formData.append(key, benefit[key]);
          }
        });
        
        // Append files (only if they exist)
        if (benefit.oldpayslip instanceof File) {
            formData.append('oldpayslip', benefit.oldpayslip);
        }
        if (benefit.currentpayslip instanceof File) {
            formData.append('currentpayslip', benefit.currentpayslip);
        }
        if (benefit.supportdocuments instanceof File) {
            formData.append('supportdocuments', benefit.supportdocuments);
        }
        if (benefit.supportdocument instanceof File) {
            formData.append('supportdocument', benefit.supportdocument);
        }
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_HOST}/admin/process-member-application`, 
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            
            showNotification(res.data.message, "success");
            
            // Clear form after successful submission based on user role
            if (userData.status !== "admin") {
              // For non-admin users, reset to their userData values
              setBenefit({
                status: "",
                approved_by: "",
                email: userData?.email || "",
                memberpin: userData?.memberpin || "",
                lname: userData?.lname || "",
                fname: userData?.fname || "",
                saddress: "",
                address: userData?.address || "",
                date: "",
                benefit: "",
                pschool: "",
                cschool: "",
                applicant_number: userData?.number || "",
                head_number: "",
                HeadteacherName: "",
                oldpayslip: null,
                currentpayslip: null,
                supportdocuments: null,
                supportdocument: null,
              });
            } else {
              // For admin users, reset to empty
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
                oldpayslip: null,
                currentpayslip: null,
                supportdocuments: null,
                supportdocument: null,
              });
            }
            
            // Reset file input fields
            e.target.reset();
            
        } catch (err) {
            console.error("Submission error:", err);
            showNotification(err.response?.data?.message || "Error submitting application", "error");
        } finally {
          setSubmitting(false)
     }
   };
  
  // Handle file input changes
  const handleFileChange = (e, fieldName) => {
    if (e.target.files && e.target.files[0]) {
      setBenefit({
        ...benefit,
        [fieldName]: e.target.files[0]
      });
    }
  };
  
  // Handle input changes with proper null checks
  const handleInputChange = (e, fieldName) => {
    setBenefit({
      ...benefit,
      [fieldName]: e.target.value
    });
  };
  
  // Determine if field should be disabled (disabled for non-admin users)
  const isFieldDisabled = (fieldName) => {
    // Fields that should use userData for non-admin users
    const userDataFields = ['fname', 'lname', 'email', 'memberpin', 'address', 'applicant_number'];
    return userData.status !== "admin" && userDataFields.includes(fieldName);
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
          <p className="text-xs text-[#AAAAAA]">welcome back, {userData?.fname || 'User'}</p>
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
                  value={benefit.fname || ''}
                  disabled={isFieldDisabled('fname')}
                  onChange={e => handleInputChange(e, 'fname')}
                  required   
                />
                {isFieldDisabled('fname') && <p className="text-xs text-gray-500 mt-1">Field disabled - uses your profile data</p>}
              </div>
              
              <div className="w-full">
                <label htmlFor="mname" className="block text-sm font-medium mb-1">Other Names</label>
                <input 
                  type="text" 
                  placeholder="Enter Other Names" 
                  id="mname" 
                  className="p-2 w-full text-sm border-2 rounded bg-transparent disabled:cursor-not-allowed focus:outline-none focus:border-blue-400"
                  value={benefit.lname || ''}
                  disabled={isFieldDisabled('lname')}
                  onChange={e => handleInputChange(e, 'lname')}
                  required  
                />
                {isFieldDisabled('lname') && <p className="text-xs text-gray-500 mt-1">Field disabled - uses your profile data</p>}
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
                  value={benefit.date || ''}
                  onChange={e => handleInputChange(e, 'date')}
                  required
                />
              </div>
              
              <div className="w-full">
                <label htmlFor="apn" className="block text-sm font-medium mb-1">Applicant Phone Number</label>
                <input 
                  type="text"
                  placeholder="Enter Applicant Phone Number"
                  id="apn"
                  value={benefit.applicant_number || ''}
                  disabled={isFieldDisabled('applicant_number')}
                  onChange={e => handleInputChange(e, 'applicant_number')}
                  required
                  className="p-2 w-full text-sm border-2 rounded bg-transparent disabled:cursor-not-allowed focus:outline-none focus:border-blue-400" 
                />
                {isFieldDisabled('applicant_number') && <p className="text-xs text-gray-500 mt-1">Field disabled - uses your profile data</p>}
              </div>
              
              <div className="w-full">
                <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
                <input
                  type="text"
                  placeholder="Enter Address"
                  id="address"
                  value={benefit.address || ''}
                  disabled={isFieldDisabled('address')}
                  onChange={e => handleInputChange(e, 'address')}
                  required
                  className="p-2 w-full text-sm border-2 rounded bg-transparent disabled:cursor-not-allowed focus:outline-none focus:border-blue-400" 
                />
                {isFieldDisabled('address') && <p className="text-xs text-gray-500 mt-1">Field disabled - uses your profile data</p>}
              </div>
              
              <div className="w-full">
                <label htmlFor="benefit" className="block text-sm font-medium mb-1">Type of Benefit</label>
                <select 
                  value={benefit.benefit || ''}
                  onChange={(e) => handleInputChange(e, 'benefit')} 
                  id="benefit" 
                  className="p-2 w-full text-sm border-2 rounded bg-transparent focus:outline-none focus:border-blue-400"
                  required
                >
                  <option value="">Select benefit</option>
                  {
                    userData.status == "admin" ? (<>
                          <option value="death of member">Death of Member</option>
                    </>) : (<>
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
                      </>)
                  }
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
                  value={benefit.email || ''}
                  disabled={isFieldDisabled('email')}
                  onChange={e => handleInputChange(e, 'email')}
                  required  
                />
                {isFieldDisabled('email') && <p className="text-xs text-gray-500 mt-1">Field disabled - uses your profile data</p>}
              </div>
              
              <div className="w-full">
                <label htmlFor="pin" className="block text-sm font-medium mb-1">Membership Pin</label>
                <input
                  type="text"
                  placeholder="Enter Membership Pin" 
                  id="pin" 
                  className="p-2 w-full text-sm border-2 rounded bg-transparent disabled:cursor-not-allowed focus:outline-none focus:border-blue-400"
                  value={benefit.memberpin || ''}
                  disabled={isFieldDisabled('memberpin')}
                  onChange={e => handleInputChange(e, 'memberpin')}
                  required
                />
                {isFieldDisabled('memberpin') && <p className="text-xs text-gray-500 mt-1">Field disabled - uses your profile data</p>}
              </div>
              
              <div className="w-full">
                <label htmlFor="school" className="block text-sm font-medium mb-1">Current School/Office</label>
                <input
                  type="text"
                  placeholder="Enter data here" 
                  id="school"
                  value={benefit.cschool || ''}
                  onChange={e => handleInputChange(e, 'cschool')}
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
                  value={benefit.head_number || ''}
                  onChange={e => handleInputChange(e, 'head_number')}
                  maxLength={14}
                  required
                />
              </div>
              
              <div className="w-full">
                <label htmlFor="pschool" className="block text-sm font-medium mb-1">Previous School/Office</label>
                <input
                  type="text"
                  value={benefit.pschool || ''}
                  onChange={e => handleInputChange(e, 'pschool')}
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
                  value={benefit.HeadteacherName || ''}
                  onChange={e => handleInputChange(e, 'HeadteacherName')}
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
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'oldpayslip')}
                  required
                  className="p-2 w-full text-sm border-2 rounded bg-transparent file:mr-2 file:py-1 file:px-3 file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {benefit.oldpayslip && <p className="text-xs mt-1 text-green-600">File selected: {benefit.oldpayslip.name}</p>}
              </div>
              
              <div className="w-full">
                <label htmlFor="cp" className="block text-sm font-medium mb-1">Current Pay Slip</label>
                <input
                  type="file"
                  id="cp"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="p-2 w-full text-sm border-2 rounded bg-transparent file:mr-2 file:py-1 file:px-3 file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={(e) => handleFileChange(e, 'currentpayslip')}
                  required
                />
                {benefit.currentpayslip && <p className="text-xs mt-1 text-green-600">File selected: {benefit.currentpayslip.name}</p>}
              </div>
              
              <div className="w-full">
                <label htmlFor="sd" className="block text-sm font-medium mb-1">Supporting Documents</label>
                <input
                  type="file"
                  id="sd"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="p-2 w-full text-sm border-2 rounded bg-transparent file:mr-2 file:py-1 file:px-3 file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={(e) => handleFileChange(e, 'supportdocuments')}
                  required
                />
                {benefit.supportdocuments && <p className="text-xs mt-1 text-green-600">File selected: {benefit.supportdocuments.name}</p>}
              </div>
              
              <div className="w-full">
                <label htmlFor="od" className="block text-sm font-medium mb-1">Other Supporting Documents</label>
                <input
                  type="file"
                  id="od"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="p-2 w-full text-sm border-2 rounded bg-transparent file:mr-2 file:py-1 file:px-3 file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={(e) => handleFileChange(e, 'supportdocument')}
                  required
                />
                {benefit.supportdocument && <p className="text-xs mt-1 text-green-600">File selected: {benefit.supportdocument.name}</p>}
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
                onClick={() => {
                  if (userData.status !== "admin") {
                    // For non-admin users, reset to their userData values
                    setBenefit({
                      status: "",
                      approved_by: "",
                      email: userData?.email || "",
                      memberpin: userData?.memberpin || "",
                      lname: userData?.lname || "",
                      fname: userData?.fname || "",
                      saddress: "",
                      address: userData?.address || "",
                      date: "",
                      benefit: "",
                      pschool: "",
                      cschool: "",
                      applicant_number: userData?.number || "",
                      head_number: "",
                      HeadteacherName: "",
                      oldpayslip: null,
                      currentpayslip: null,
                      supportdocuments: null,
                      supportdocument: null,
                    });
                  } else {
                    // For admin users, reset to empty
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
                      oldpayslip: null,
                      currentpayslip: null,
                      supportdocuments: null,
                      supportdocument: null,
                    });
                  }
                }}
              >
                Clear
              </button>
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full sm:w-24 bg-green-400 font-bold text-white py-2 rounded-md hover:bg-green-500 transition-colors"
              >
                {
                  submitting  ? "Submitting" : "Submit"
                }
              </button>
            </div>
          </div>
        </form>
        <a onClick={() => setHomePage("Dashboard")} className="text-blue-700 underline cursor-pointer" > Go Back </a>
      </div>     
      <p className="text-xs text-center text-[#AAAA] mt-4">Copyright &copy; 2026-2027 AltBit Softwares</p>
      
    </div>
  );
};

export default Apply;