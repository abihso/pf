import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
const MemberApplications = () => {
  const [infor, setInfor] = useState(false);
  const navigate = useNavigate();
  const viewApplication = (appId, pin) => {
    navigate(`/view/${appId}/${pin}`);
  };
      useEffect(() => {
        axios
              .get(
                `${import.meta.env.VITE_HOST}/admin/get-member-application/${localStorage.getItem("userId")}`
              )
              .then((response) => {
                console.log(response)
                setInfor(response.data.data);
              })
              .catch((err) => {
                console.log(err);
              });
          // .catch(() => (window.location = "/"));
      }, []);
  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-text-primary-dark text-text-primary-light">
            Applictions
          </h1>
          <p className="text-sm dark:text-text-secondary-dark text-text-secondary-light">
            Track your applications and benefits here
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button
            onClick={() => (window.location.href = "/form")}
            className="px-4 py-2 rounded-lg bg-accent text-white flex items-center gap-2"
          >
            <span>💾</span> Apply
          </button>
        </div>
      </div>
      <div className="dark:bg-card-dark bg-card-light rounded-xl border dark:border-border-dark border-border-light shadow-sm mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="dark:bg-accent-dark bg-accent-light">
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">
                  Pin
                </th>

                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">
                  Benefit
                </th>
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">
                  Status
                </th>
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">
                  Approved by
                </th>
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">
                  Date
                </th>
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {infor && infor.length > 0 ? (
                infor.map((item, index) => (
                  <tr key={index}>
                    <td>{item.memberpin}</td>
                    <td>{item.benefit.toUpperCase()}</td>
                    <td>{item.status.toUpperCase()}</td>
                    <td>{item.approved_by.toUpperCase()}</td>
                    <td>{item.date.slice(0, 10)}</td>
                    <td>
                      <a
                        onClick={() => viewApplication(item.id, item.memberpin)}
                        className="text-xs pl-2 cursor-pointer"
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
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MemberApplications;