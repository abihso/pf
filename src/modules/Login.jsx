/* eslint-disable no-unused-vars */
import { useState } from 'react';
import axios from 'axios';
import icon from "../assets/icons/presby.jpg"

const Login = () => {
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [role, setRole] = useState("");
    const [credentials, setCredentials] = useState({
      password : "",
      memberpin: "",
    })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(false)
    setSuccess(false)
    
    axios.post(`${import.meta.env.VITE_HOST}/auth/login`, { ...credentials, role }).then(res => {
      console.log(res)
      window.localStorage.setItem("token", res.data.token)
      setSuccess(true)
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1500);
    }).catch(err => {
      console.error(err)
      setError(true)
      setErrorMessage(err.response?.data?.message || "Invalid credentials. Please try again.")
      setTimeout(() => {
        setError(false)
      }, 3000);
    })
  }

  return (
    <div className='flex flex-col lg:flex-row justify-between min-h-screen'>
      {/* Success Notification */}
      {success && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-md">
          <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Login successful! Redirecting to dashboard...</span>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-md">
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Top Section - Church Info (Mobile: top, Desktop: left) */}
      <div className='gradient w-full lg:w-1/2 min-h-[40vh] lg:min-h-screen pt-10 lg:pt-20 px-4 order-1 lg:order-1'>
        <p className='font-extrabold text-lg text-center'>AltBit Softwares</p>
        <p className='text-center font-bold'>welfare app</p>
        <div className='flex justify-center items-center flex-col'>
            <div className='w-32 h-32 lg:w-44 lg:h-44 mt-5 lg:mt-10 flex justify-center items-center bg-[#F6F6F6] rounded-lg'>
              <img src={icon} alt="" width={100} className='lg:w-120' />
            </div>
            <p className='font-extrabold text-lg lg:text-xl text-center mt-3'>Presbyterian Church - Ghana</p>
            <p className='text-sm text-center'>Welfare Management System</p>
        </div>
      </div>
      
      {/* Bottom Section - Login Form (Mobile: bottom, Desktop: right) */}
      <div className='w-full lg:w-1/2 flex items-end lg:items-center justify-center px-4 pb-8 lg:pb-0 order-2 lg:order-2'>
        <div className='w-full max-w-md'>
          <p className='text-center mt-5 lg:mt-20 font-extrabold text-lg lg:text-xl'>Welcome back, Please Sign-in to continue</p> 
          <div className='border-red-300 border px-5 lg:px-7 py-5 lg:py-3 mt-5 rounded-lg'>
            <p className='font-bold text-base lg:text-lg'>Sign In</p>
            <p className='text-xs mt-1'>Select your role and credentials to access the dashboard</p>
            <div className='mt-3'>
              <form onSubmit={handleSubmit}>
                  <div>
                     <label htmlFor="role" className='text-black font-bold text-xs lg:text-sm'>Role</label>
                      <select 
                        name="role" 
                        id="role" 
                        value={role} 
                        onChange={e => setRole(e.target.value)} 
                        className='w-full text-xs bg-[#F6F6F6] font-bold h-12 lg:h-10 text-black px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200'
                        required
                      >
                        <option value={""}>Select role</option>
                        <option value={"Administrator"}>Administrator</option>
                        <option value={"Member"}>Member</option>
                      </select>
                  </div>
                  
                  <div className='mt-3'>
                    <label htmlFor="pin" className='text-black font-bold text-xs lg:text-sm'>Pin</label>
                    <input 
                      type="text" 
                      value={credentials.memberpin} 
                      onChange={e => setCredentials({...credentials, memberpin: e.target.value})} 
                      className='w-full bg-[#F6F6F6] text-xs h-12 lg:h-10 text-black font-bold px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200' 
                      name="pin" 
                      id="pin" 
                      placeholder='Enter Pin Code'
                      required
                    />
                  </div>
                  
                  <div className='mt-3'>
                    <label htmlFor="password" className='text-black font-bold text-xs lg:text-sm'>Password</label>
                    <input 
                      type="password" 
                      value={credentials.password} 
                      onChange={e => setCredentials({...credentials, password: e.target.value})} 
                      className='w-full bg-[#F6F6F6] h-12 lg:h-10 text-black text-xs font-bold px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200' 
                      name="password" 
                      id="password" 
                      placeholder='Enter Password'
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className='font-bold w-full mt-5 bg-[#F1F2F7] border-2 h-12 lg:h-10 border-[#D8D8D8] rounded-md hover:bg-[#E4E6EE] transition-colors'
                  >
                    Sign In
                  </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;