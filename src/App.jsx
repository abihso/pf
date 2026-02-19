import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Admin from "./modules/Admin.jsx";
import Login from "./modules/Login.jsx";
import ApplicationView from "./modules/ViewData.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Admin />} />
        <Route path="/view/:appId/:pin" element={<ApplicationView />} />
      </Routes>
    </Router>
  );
};

export default App;
