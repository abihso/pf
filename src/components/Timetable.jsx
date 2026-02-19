const Timetable = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-text-primary-dark text-text-primary-light">Timetable Management</h1>
          <p className="text-sm dark:text-text-secondary-dark text-text-secondary-light">
            Create and manage school timetables
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <button className="px-4 py-2 rounded-lg dark:bg-accent-dark bg-accent-light text-white flex items-center gap-2">
            <span>📤</span> Export
          </button>
          <button className="px-4 py-2 rounded-lg bg-accent text-white flex items-center gap-2">
            <span>➕</span> Create Timetable
          </button>
        </div>
      </div>

      {/* Timetable Filters */}
      <div className="dark:bg-card-dark bg-card-light rounded-xl p-4 border dark:border-border-dark border-border-light shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-text-secondary-dark text-text-secondary-light">Select Class</label>
            <select className="w-full dark:bg-secondary-dark bg-secondary-light border dark:border-border-dark border-border-light rounded-lg px-4 py-2">
              <option>Grade 7A</option>
              <option>Grade 6B</option>
              <option>Grade 9A</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-text-secondary-dark text-text-secondary-light">Select Term</label>
            <select className="w-full dark:bg-secondary-dark bg-secondary-light border dark:border-border-dark border-border-light rounded-lg px-4 py-2">
              <option>Term 1 (2023-2024)</option>
              <option>Term 2 (2023-2024)</option>
              <option>Term 3 (2023-2024)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-text-secondary-dark text-text-secondary-light">Select Week</label>
            <select className="w-full dark:bg-secondary-dark bg-secondary-light border dark:border-border-dark border-border-light rounded-lg px-4 py-2">
              <option>Week 1</option>
              <option>Week 2</option>
              <option>Week 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timetable View */}
      <div className="dark:bg-card-dark bg-card-light rounded-xl border dark:border-border-dark border-border-light shadow-sm">
        <div className="flex justify-between items-center p-4 border-b dark:border-border-dark border-border-light">
          <h2 className="text-xl font-semibold dark:text-text-primary-dark text-text-primary-light">
            Grade 7A Timetable - Term 1 (2023-2024)
          </h2>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg dark:bg-accent-dark bg-accent-light text-white">
              Print
            </button>
            <button className="px-4 py-2 rounded-lg bg-accent text-white">
              Edit
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="dark:bg-accent-dark bg-accent-light">
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">Time/Day</th>
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">Monday</th>
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">Tuesday</th>
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">Wednesday</th>
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">Thursday</th>
                <th className="px-4 py-2 text-left dark:text-text-primary-dark text-white">Friday</th>
              </tr>
            </thead>
            <tbody>
              {[
                { time: '8:00 - 8:45', subjects: ['Mathematics', 'Mathematics', 'English', 'Mathematics', 'History'] },
                { time: '8:45 - 9:30', subjects: ['Mathematics', 'Mathematics', 'English', 'Mathematics', 'History'] },
                { time: '9:30 - 10:15', subjects: ['English', 'Mathematics', 'Physical Education', 'Science', 'Art'] },
                { time: '10:15 - 11:00', subjects: ['English', 'Mathematics', 'Physical Education', 'Science', 'Art'] },
              ].map((row, index) => (
                <tr key={index} className="border-b dark:border-border-dark border-border-light">
                  <td className="px-4 py-3">{row.time}</td>
                  {row.subjects.map((subject, idx) => (
                    <td key={idx} className="px-4 py-3">
                      <div>{subject}</div>
                      <div className="text-xs dark:text-text-secondary-dark text-text-secondary-light">
                        {subject === 'Physical Education' ? 'Playground' : subject === 'Art' ? 'Room 105' : `Room 10${idx + 1}`}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Timetable;