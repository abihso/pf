import { useState } from "react";
const BackgroundBox = () => {
  const [codeBox, setCodeBox] = useState(false)
  const [code,setCode] = useState("")
  const handleExamCode = () => {
    setCodeBox(true)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (code.length < 1) return alert("Please Enter Code")
    if (confirm("Will you like to proceed")) {
      localStorage.setItem("code", code);
      window.location = "/exams";
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-text-primary-dark text-text-primary-light">
            Exam Dashboard
          </h1>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button
            onClick={handleExamCode}
            className="px-4 py-2 rounded-lg dark:bg-accent-dark bg-accent-light text-white flex items-center gap-2"
          >
            <span>📤</span> Exam Code
          </button>
          {/* <button className="px-4 py-2 rounded-lg bg-accent text-white flex items-center gap-2">
            <span>➕</span> Create Exam
          </button> */}
        </div>
      </div>
      {codeBox && (
        <div className="w-full flex justify-center ">
          <div className="modal-content">
            <div className="modal-header">Login Page</div>
            <form onSubmit={handleSubmit}>
              {" "}
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={() => setCodeBox((pre) => !pre)}
                  type="reset"
                  className="btn btn-secondary"
                >
                  Cancel
                </button>{" "}
                <button type="submit" className="btn btn-primary">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundBox;