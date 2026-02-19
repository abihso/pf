import { RxUpdate } from "react-icons/rx"; 
import { useEffect, useState } from 'react';
import { AiFillDelete } from "react-icons/ai"; 
import axios from 'axios';
const RegisterMember = () => {
  const [data, setData] = useState([])
  const handleUpdate = (id) => {
    window.location.href = `/update-member/${id}`;
  }
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_HOST}/admin/get-all-members`)
      .then((res) => {
        setData(res.data.data)
      })
      .catch((err) => console.log(err));
  },[])
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
  const handleSearch = (e) => {
    axios
      .get(`${import.meta.env.VITE_HOST}/admin/get-member/${e.target.value}`)
      .then((res) => setData(res.data.data))
      .catch((err) => console.log(err));
  }
  const [modal, setModal] = useState("");
  // Functions //
  const deleteMember = (id) => {
    axios
      .get(`${import.meta.env.VITE_HOST}/admin/delete-member/${id}`)
      .then(() => (window.location.href = "/admin/dashboard"))
      .catch((err) => console.log(err));
  }
  const handleAddMemberForm = (e) => {
    e.preventDefault();
    axios.post(`${import.meta.env.VITE_HOST}/admin/register-member`, infor, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    }).then(() => alert('User saved')).catch(err => {
     err.response.data.code == "SQLITE_CONSTRAINT_UNIQUE" ? alert('User already exist') : alert("Problem saving user")
    })
  };

  return (
    <div>
      {modal == "member" ? (
        <div
          className="modal"
          id="add-student-modal"
          role="dialog"
          aria-labelledby="addStudentModalTitle"
          aria-modal="true"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title" id="addStudentModalTitle">
                Add New Member
              </h2>
              <a
                onClick={() => setModal("")}
                className="modal-close"
                aria-label="Close modal"
              >
                &times;
              </a>{" "}
            </div>
            <form onSubmit={handleAddMemberForm}>
              {" "}
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label
                      htmlFor="student-first-name" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="student-first-name"
                      value={infor.fname}
                      onChange={(e) => setInfor({...infor,fname:e.target.value})}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="student-last-name" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="student-last-name"
                      value={infor.lname}
                      onChange={(e) => setInfor({...infor,lname:e.target.value})}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="student-email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="student-email"
                      value={infor.email}
                      onChange={(e) => setInfor({...infor,email:e.target.value})}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="student-address" className="form-label">
                      Address
                    </label>
                    <input
                      type="text"
                      id="student-address"
                      value={infor.address}
                      onChange={(e) => setInfor({...infor,address:e.target.value})}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="member-contact" className="form-label">
                    Member's Pin
                  </label>
                  <input
                    type="text"
                    id="member-contact"
                    value={infor.memberpin}
                    onChange={(e) => setInfor({...infor,memberpin:e.target.value})}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="student-dob" className="form-label">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="student-dob"
                    value={infor.dob}
                      onChange={(e) => setInfor({...infor,dob:e.target.value})}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="student-pic" className="form-label">
                    Picture
                  </label>
                  <input
                    type="file"
                    id="student-pic"
                    onChange={(e) => setInfor({...infor,img:e.target.files[0]})}
                    className="form-control"
                    // required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="student-gender" className="form-label">
                    Gender
                  </label>
                  <select
                    id="student-gender"
                    value={infor.gender}
                    onChange={(e) => setInfor({...infor,gender:e.target.value})}
                    className="form-control"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="student-className" className="form-label">
                    Assign School
                  </label>
                  <input
                    type="text"
                    id="student-className"
                    value={infor.school}
                    onChange={(e) => setInfor({...infor,school:e.target.value})}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="member-contact" className="form-label">
                    Member's Contact
                  </label>
                  <input
                    type="tel"
                    id="member-contact"
                    value={infor.number}
                    onChange={(e) => setInfor({...infor,number:e.target.value})}
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <a onClick={() => setModal("")} className="btn cursor-pointer btn-secondary">
                  Cancel
                </a>{" "}
                <button type="submit" className="btn btn-primary">
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-text-primary-dark text-text-primary-light">
            Members Management
          </h1>
          <p className="text-sm dark:text-text-secondary-dark text-text-secondary-light">
            Manage all members records and information
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button className="px-4 py-2 rounded-lg dark:bg-accent-dark bg-accent-light text-white flex items-center gap-2">
            <span>📤</span> Export
          </button>
          <button
            onClick={() => setModal("member")}
            className="px-4 py-2 rounded-lg bg-accent text-white flex items-center gap-2"
          >
            <span>➕</span> Add Member
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
            🔍
          </span>
          <input
            onChange={(e) => handleSearch(e)}
            type="text"
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-2 rounded-lg dark:bg-secondary-dark bg-secondary-light border dark:border-border-dark border-border-light"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="dark:bg-card-dark  bg-card-light rounded-xl border dark:border-border-dark border-border-light shadow-sm overflow-hidden">
        <div className="grid grid-cols-12">
         <div className='col-span-1 w-full px-4 py-2 dark:text-text-primary-dark text-white text-center ' >Pin</div>
         <div className='col-span-2 w-full px-4 py-2 dark:text-text-primary-dark text-white text-center ' >Member</div>
         <div className='col-span-2 w-full px-4 py-2 dark:text-text-primary-dark text-white text-center ' >Number</div>
         <div className='col-span-3 w-full px-4 py-2 dark:text-text-primary-dark text-white text-center ' >Email</div>
         <div className='col-span-2 w-full px-4 py-2 dark:text-text-primary-dark text-white text-center ' >School</div>
         <div className='col-span-2 w-full px-4 py-2 dark:text-text-primary-dark text-white text-center ' >Action</div>
        </div>
        <div className='max-h-[600px] overflow-y-scroll text-[12px]' >
              {
                data.length > 0 ? (
                data.map((item, index) => (
                     <div key={index} className="grid gap-2 grid-cols-12 border-t  border-gray-400">
                        <div className='col-span-1 w-full px-4 py-2 text-center dark:text-text-primary-dark text-white ' >{item.memberpin}</div>
                        <div className='col-span-2 w-full px-4 py-2 text-center dark:text-text-primary-dark text-white ' > {item.fname.toUpperCase()} {item.lname.toUpperCase()}{" "}</div>
                        <div className='col-span-2 w-full px-4 py-2 text-center dark:text-text-primary-dark text-white ' >{item.number} </div>
                        <div className='col-span-3 w-full px-4 py-2 text-center dark:text-text-primary-dark text-white flex overflow-hidden flex-wrap ' >{item.email}</div>
                        <div className='col-span-2 w-full px-4 py-2 text-center dark:text-text-primary-dark text-white ml-2' >{item.school.toUpperCase()}</div>
                        <div className='col-span-2 w-full px-4 py-2 text-center dark:text-text-primary-dark text-white flex gap-2  ' ><button
                        onClick={() => deleteMember(item.memberpin)}
                        className=" p-1 rounded-lg hover:text-blacktext-sm font-bold "
                      >
                        {" "}
                        <AiFillDelete className="text-red-500 text-2xl" />
                      </button>
                      <button
                        onClick={() => handleUpdate(item.memberpin)}
                        className="p-1 rounded-lg text-black w-56 h-8 font-bold "
                      >
                        
                        <RxUpdate className="text-green-500 text-2xl" />
                      </button></div>
                  </div>
                  ))
              ) : (
                <p className='text-center' >No data</p>
              )}
        </div>
        
       
      </div>
    </div>
  );
};

export default RegisterMember;