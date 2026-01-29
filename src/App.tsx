
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Inspections from "./pages/Inspections";
import Documents from "./pages/Documents";
import Tools from "./pages/Tools";
import Contracts from "./pages/Contracts";
import Timesheets from "./pages/Timesheets";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/inspections" element={<Inspections />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/contracts" element={<Contracts />} />
        <Route path="/timesheets" element={<Timesheets />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
