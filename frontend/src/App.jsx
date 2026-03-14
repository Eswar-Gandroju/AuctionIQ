import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TeamProvider } from "./context/TeamContext";
import TeamBuilder from "./pages/TeamBuilder";
import Compare from "./pages/Compare";

export default function App() {
  return (
    /* 1. The Context Provider handles your Shortlist and Player1 state globally */
    <TeamProvider>
      <Router>
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-green-500/30">
          
          <Routes>
            {/* 2. Landing Page: Requirements Panel + Results (Sketch 2) */}
            <Route path="/" element={<TeamBuilder />} />
            
            {/* 3. Dedicated Compare Page: Animated Radar Charts (Sketch 3) */}
            <Route path="/compare" element={<Compare />} />
          </Routes>

          {/* Optional: Add a Global Navigation or Footer here if needed */}
        </div>
      </Router>
    </TeamProvider>
  );
}