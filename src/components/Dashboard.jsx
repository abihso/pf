import StatCard from './StatCard';
import ActivityItem from './ActivityItem';
import ActionButton from './ActionButton';
import { AiOutlineClose } from "react-icons/ai"; 
import { GiCheckMark } from "react-icons/gi"; 
import { useEffect, useState } from 'react';
import axios from 'axios';
const Dashboard = ({ stats, activities, quickActions, dashboardInfo, setModal }) => {
  const [messageModal, setMessageModal] = useState(false)
  const [message, setMessage] = useState([])
  const [data, setData] = useState([])
  useEffect(() => {  
    Promise.all([
      axios.get(`${import.meta.env.VITE_HOST}/admin/get-all-message`),
      axios.get(`${import.meta.env.VITE_HOST}/admin/get-all-applications`)
    ]).then(res => {
     setData(res[1].data.data)
      setMessage(res[0].data.data)
    })
  }, [])
  
  const deleteMessage = (id) => {
    if (confirm("You are about to delete this message")) {
        axios
          .get(`${import.meta.env.VITE_HOST}/admin/delete-message/${id}`)
          .then(() => {
            window.location.href = "/admin/dashboard";
          })
          .catch((err) => console.log(err))
          .finally(() => {
                 window.location.href = "/admin/dashboard";
          })
    }
    
  }
   const handleSearch = (e) => {
    axios
      .get(`${import.meta.env.VITE_HOST}/admin/get-specific-application-by-members/${e.target.value}`)
      .then((res) => setData(res.data.data))
      .catch((err) => console.log(err));
  }

  return (
    <div>
      {messageModal == "messages" ? (
        <div
          className="modal"
          id="add-student-modal"
          role="dialog"
          aria-labelledby="addStudentModalTitle"
          aria-modal="true"
        >
          <div className="modal-content overflow-y-scroll max-h-[600px]">
            <div className="modal-header">
              <h2 className="modal-title" id="addStudentModalTitle">
                Messages
              </h2>
              <a
                onClick={() => setMessageModal(false)}
                className="modal-close"
                aria-label="Close modal"
              >
                &times;
              </a>{" "}
            </div>
            {message.map((item, index) => (
              <div key={index} className="mt-2 grid grid-flow-col border border-gray-400 p-2 ">
                <div className="col-span-10">
                  <h4 className="font-bold">{item.title}</h4>
                  <p>{item.body}</p>
                </div>
                <div onClick = {() => deleteMessage(item.id)} className =" flex col-span-2 cursor-pointer justify-center items-center " >❌ </div>
              </div>
            ))}
            
          </div>
        </div>
      ) : null}
      <div className="mb-6">
        <h1 className="text-2xl font-bold dark:text-text-primary-dark text-text-primary-light">
          {dashboardInfo[0]}
        </h1>
        <p className="text-sm dark:text-text-secondary-dark text-text-secondary-light">
          {dashboardInfo[1]}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
            🔍
          </span>
          <input
            onChange={(e) => handleSearch(e)}
            type="search"
            placeholder="Search application"
            className="w-full pl-10 pr-4 py-2 rounded-lg dark:bg-secondary-dark bg-secondary-light border dark:border-border-dark border-border-light"
          />
        </div>
      </div>
      <div className="dark:bg-card-dark bg-card-light rounded-xl border dark:border-border-dark border-border-light shadow-sm py-3 pl-2 mb-6">
              <div className="overflow-x-auto text-sm">
                <div className='grid grid-cols-12 font-bold text-center' >
                  <div className="col-span-3">Memer Pin</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-3">Benefit</div>
                  <div className="col-span-3">Status</div>
                </div>
                <div className=' text-sm h-40 overflow-y-scroll' >
                 {
                  data.length == 0 ? <p>Start typing to search</p> : data.map((item, index) => (
                    <div key={index} className='grid grid-cols-12 text-center border-t-2 pt-2' >
                      <div className="col-span-3">{ item.memberpin }</div>
                      <div className="col-span-3">{ item.fname } { item.lname }</div>
                      <div className="col-span-3">{ item.benefit }</div>
                      <div className="col-span-3">{ item.status  == "claimed" ? "Paid" : item.status}</div>
                  </div>
                  ))
                 } 
                </div>
              </div>
            </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="dark:bg-card-dark bg-card-light rounded-xl p-4 border dark:border-border-dark border-border-light shadow-sm">
            <h2 className="text-lg font-semibold mb-4 dark:text-text-primary-dark text-text-primary-light">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3 cursor-pointer">
              {quickActions.map((action, index) => (
                <ActionButton key={index} {...action} setModal={setModal} />
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="dark:bg-card-dark bg-card-light rounded-xl max-h-[600px] overflow-y-scroll p-4 border dark:border-border-dark border-border-light shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold dark:text-text-primary-dark text-text-primary-light">
                Recent Activity
              </h2>
              <a
                onClick={() => setMessageModal("messages")}
                className="text-sm text-accent cursor-pointer "
              >
                View All
              </a>
            </div>
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  <ActivityItem key={index} {...activity} />
                ))
              ) : (
                <p> No Data Available </p>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;