import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Issues from './pages/Issues';
import SecurityHotspots from './pages/SecurityHotspots';
import Measures from './pages/Measures';
import Rules from './pages/Rules';
import QualityGates from './pages/QualityGates';
import ActivityPage from './pages/ActivityPage';

export default function App() {
  return (
    <div className="flex min-h-screen bg-[#f3f3f8]">
      <Sidebar />
      <main className="flex-1 ml-60">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:key" element={<ProjectDetail />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/security-hotspots" element={<SecurityHotspots />} />
          <Route path="/measures" element={<Measures />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/quality-gates" element={<QualityGates />} />
          <Route path="/activity" element={<ActivityPage />} />
        </Routes>
      </main>
    </div>
  );
}
