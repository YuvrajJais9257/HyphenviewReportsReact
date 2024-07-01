import React, { useState } from "react";
import NewSidebar from "./NewSidebar";
import Rightside from "./Rightside";
import "./NewDashboard.css";
function NewDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dasboardcnt">
      <NewSidebar onToggle={handleSidebarToggle} isOpen={isSidebarOpen} />
      <div className={`content ${isSidebarOpen ? "expanded" : "collapsed"}`}>
        <Rightside />
      </div>
    </div>
  );
}

export default NewDashboard;
