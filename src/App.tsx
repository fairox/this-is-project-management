
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

      {/* Temporary Seeding Trigger */}
      <div style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
        <button
          onClick={async () => {
            const { seedProjects } = await import("./utils/seedProjects");
            seedProjects();
          }}
          style={{ padding: '5px 10px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', opacity: 0.5 }}
        >
          Seed Data
        </button>
      </div>
    </Router>
  );
}

export default App;
