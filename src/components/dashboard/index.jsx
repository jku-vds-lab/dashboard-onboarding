import React, { useState, useEffect } from "react";

import NodesCanvas from "../nodesCanvas";

import "../../assets/css/dashboard.scss";

let enableResizeVar = false;

const Dashboard = () => {
  const [width, setWidth] = useState({ left: 70, right: 30 });
  const [resizing, setResizing] = useState(false);

  useEffect(() => {
    const handleWindowMouseMove = (event) => {
      if (!enableResizeVar) return;

      const x = event.clientX;
      const screenWidth = window.innerWidth;
      const takenSpace = screenWidth - x;

      setWidth({
        left: (x / screenWidth) * 100,
        right: (takenSpace / screenWidth) * 100,
      });
    };
    window.addEventListener("mousemove", handleWindowMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
    };
  }, []);

  return (
    <div className={`dashboard ${resizing ? "resizing" : ""}`}>
      <div className="left" style={{ width: `${width.left}%` }}>
        <div className="flow">
          <NodesCanvas />
        </div>
        <div className="timeline">Timeline</div>
      </div>
      <div className="right" style={{ width: `${width.right}%` }}>
        <div className="inner">
          <p>Sidebar</p>
          <div
            className="resize"
            onMouseDown={() => {
              enableResizeVar = true;
              setResizing(true);
            }}
            onMouseUp={() => {
              enableResizeVar = false;
              setResizing(false);
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
