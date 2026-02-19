import { AiOutlineClose } from "react-icons/ai"; 
import { GiCheckMark } from "react-icons/gi"; 
import { AiFillDelete } from "react-icons/ai"; 
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
const AdminApplications = () => {
  const navigate = useNavigate();
   const handleButtonClick = (id, status, validated_by) => {
       axios
         .get(
           `${import.meta.env.VITE_HOST}/admin/update-record/${id}/${status}/${validated_by}`
         )
         .then((res) => alert(res.data.message))
         .catch((err) => console.log(err));
     }
  const [data, setData] = useState(false)
    const viewApplication = (appId,pin) => {
    navigate(`/view/${appId}/${pin}`);
  };
  
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_HOST}/admin/get-all-applications`).then((res) => {
      setData(res.data.data)
    }).catch(err => console.log(err))
      
  }, []);

 
  
   let capitalize = (word) => {
     return word
       .split(" ")
       .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
       .join(" ");
   };
  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-text-primary-dark text-text-primary-light">
            Applications
          </h1>
          <p className="text-sm dark:text-text-secondary-dark text-text-secondary-light">
            Record and track members applications
          </p>
        </div>
      </div>

      <div className="dark:bg-card-dark bg-card-light rounded-xl border dark:border-border-dark border-border-light shadow-sm mb-6">
        <div className="overflow-x-auto text-sm">
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
                  Benefit
                </th>
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">
                  Number
                </th>
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">
                  Status
                </th>
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">
                  Verified by
                </th>
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.memberpin}</td>
                    <td>
                      {capitalize(item.fname)} {capitalize(item.lname)}
                    </td>
                    <td>{item.benefit.toUpperCase()}</td>
                    <td>{item.applicant_number}</td>
                    <td>{item.status.toUpperCase()}</td>
                    <td>{item.approved_by.toUpperCase()}</td>
                    <td className="flex gap-2">
                      <button
                        onClick={() =>
                          handleButtonClick(
                            item.id,
                            "rejected",
                            `solo`
                          )
                        }
                        className=" p-1 rounded-lg hover:text-blacktext-sm font-bold "
                      >
                        {" "} 
                       
                        <AiOutlineClose className="text-red-500 text-2xl" />
                      </button>
                      <button
                        onClick={() =>
                          handleButtonClick(
                            item.id,
                            "approved",
                            `solo`
                          )
                        }
                        className="p-1 rounded-lg font-bold text-sm"
                      >
                        {" "}
                       <GiCheckMark className="text-green-500 text-2xl" />
                      </button>
                      <a
                        onClick={() =>
                          viewApplication(item.id, item.memberpin)
                        }
                        className=" text-xs pl-2 cursor-pointer"
                      >
                        {" "}
                        view{" "}
                      </a>
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

export default AdminApplications;