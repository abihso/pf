import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ApplicationView = () => {
  const navigate = useNavigate();
  const { appId } = useParams();
  const { pin } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(false)
  
  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_HOST}/admin/get-single-application/${appId}`
        );
        setApplication(response.data.data);
      } catch (err) {
        console.error("Error fetching application:", err);
        setError("Failed to load application details");
      } finally {
        setLoading(false);
      }
    };
    axios
      .get(`${import.meta.env.VITE_HOST}/admin/get-single-member/${pin}`)
      .then((res) => {
        console.log(res)
        setImage(res.data.data.img);
      }).catch(err => console.log(err));
    fetchApplication();
  }, [appId,pin]);
  const downloadFile = async (filename) => {
    if (!filename) {
      alert("No file available for download");
      return;
    }

    await axios.get(`${import.meta.env.VITE_HOST}/admin/get-file/${filename}/document`);
  };
  const capitalize = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <p>Loading application details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <p>No application data found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Added Print Button */}
      <div className="flex justify-between mb-4">
        <img
          className="w-28 h-32"
          src={`${import.meta.env.VITE_HOST}/admin/get-file/${image}/image`}
          alt=""
        />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Application Details
        </h1>
        <div className="mt-2 flex justify-center space-x-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              application.status === "approved"
                ? "bg-green-100 text-green-800"
                : application.status === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {capitalize(application.status)}
          </span>
          <span className="text-sm text-gray-500">
            Submitted on: {formatDate(application.date)}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">
                {capitalize(application.fname)}{" "}
                {capitalize(application.lname)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Member PIN</p>
              <p className="font-medium">{application.memberpin}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-medium">{application.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">{application.applicant_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Residential Address</p>
              <p className="font-medium">{application.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date Submitted</p>
              <p className="font-medium">{formatDate(application.date)}</p>
            </div>
          </div>
        </div>

        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            School Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Current School Address</p>
              <p className="font-medium">{application.saddress}</p>
            </div>
            {application.pschool && (
              <div>
                <p className="text-sm text-gray-500">Previous School</p>
                <p className="font-medium">{application.pschool}</p>
              </div>
            )}
            {application.cschool && (
              <div>
                <p className="text-sm text-gray-500">Current School</p>
                <p className="font-medium">{application.cschool}</p>
              </div>
            )}
          </div>
        </div>

        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Benefit Information
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Benefit Type</p>
              <p className="font-medium">{capitalize(application.benefit)}</p>
            </div>
          </div>
        </div>

        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Approval Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Approved/Rejected By</p>
              <p className="font-medium">
                {capitalize(application.approved_by)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Decision Date</p>
              <p className="font-medium">{formatDate(application.updatedAt)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3 flex-wrap ">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Current Payslip
            </h2>
            {application.currentpayslip ? (
              <div className="flex items-center space-x-2">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <button
                  onClick={() => downloadFile(application.currentpayslip)}
                  className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  Download {application.currentpayslip}
                </button>
              </div>
            ) : (
              <p className="text-gray-500">No attachments available</p>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Old Payslip
            </h2>
            {application.oldpayslip ? (
              <div className="flex items-center space-x-2">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <button
                  onClick={() => downloadFile(application.oldpayslip)}
                  className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  Download {application.oldpayslip}
                </button>
              </div>
            ) : (
              <p className="text-gray-500">No attachments available</p>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Supporting Documents
            </h2>
            {application.supportdocuments ? (
              <div className="flex items-center space-x-2">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <button
                  onClick={() => downloadFile(application.supportdocuments)}
                  className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  Download {application.supportdocuments}
                </button>
              </div>
            ) : (
              <p className="text-gray-500">No attachments available</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors print:hidden"
        >
          Print Page
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          Back to Applications
        </button>
      </div>
    </div>
  );
};

export default ApplicationView;
