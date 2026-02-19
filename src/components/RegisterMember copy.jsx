import { useState,useEffect } from 'react';
import axios from 'axios';
const RegisterMember = () => {
  const [data, setData] = useState([])
  const handleUpdate = (id) => {
    window.location.href = `/update-member/${id}`;
  }
  const handleSearch = (e) => {
    axios
      .get(`${import.meta.env.VITE_HOST}/get-specific-member/${e.target.value}`)
      .then((res) => setData(res.data.data))
      .catch((err) => console.log(err));
  }
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_HOST}/get-members`)
      .then((res) => {
        setData(res.data.data.slice(0,15))
      })
      .catch(err => console.log(err));
  },[])
  
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
    const data = new FormData(e.target);
    data.append("status","member")
    axios
      .post(`${import.meta.env.VITE_HOST}/register-member`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          alert("Record Saved")
        }
      })
      .catch((err) => {
        console.log(err)
        alert(`${err.response.data.message || "Problem saving record"}`);
      });
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
                    <label htmlFor="student-first-name" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="student-first-name"
                      name="fname"
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
                      name="lname"
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
                      name="email"
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
                      name="address"
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
                    name="memberpin"
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
                    name="dob"
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
                    name="img"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="student-gender" className="form-label">
                    Gender
                  </label>
                  <select
                    id="student-gender"
                    name="gender"
                    className="form-control"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {/* <div className="form-group">
                  <label htmlFor="student-className" className="form-label">
                    Assign School
                  </label>
                  <select
                    id="student-className"
                    name="school"
                    className="form-control"
                    required
                  >
                    <option value="">Select school / office</option>
                    <option value="asokwa">asokwa</option>
                  </select>
                </div> */}

                <div className="form-group">
                  <label htmlFor="student-className" className="form-label">
                    Assign School
                  </label>
                  <input
                    type="text"
                    id="student-className"
                    name="school"
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
                    name="number"
                    className="form-control"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <a href="#_" className="btn btn-secondary">
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
      <div className="dark:bg-card-dark bg-card-light rounded-xl border dark:border-border-dark border-border-light shadow-sm overflow-hidden">
        <div className="overflow-y-scroll max-h-[600px]">
          <table className="w-full">
            <thead>
              <tr className="dark:bg-accent-dark bg-accent-light">
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">
                  Pin
                </th>
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">
                  Member
                </th>
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">
                  Number
                </th>
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">
                  Email
                </th>
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">
                  School / Office
                </th>
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {
                data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.memberpin} </td>
                    <td>
                      {item.fname.toUpperCase()} {item.lname.toUpperCase()}{" "}
                    </td>
                    <td>{item.number} </td>
                    <td>{item.email} </td>
                    <td>{item.school.toUpperCase()} </td>
                    <td className=" flex gap-2">
                      <button
                        onClick={() => deleteMember(item.memberpin)}
                        className="bg-red-400 p-1 rounded-lg text-black font-bold hover:bg-red-500 hover:text-white "
                      >
                        {" "}
                        Delete
                      </button>
                      <button
                        onClick={() => handleUpdate(item.memberpin)}
                        className="bg-green-400 p-1 rounded-lg text-black font-bold hover:bg-green-500 hover:text-white "
                      >
                        {" "}
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>No Data available</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
       
      </div>
    </div>
  );
};

export default RegisterMember;