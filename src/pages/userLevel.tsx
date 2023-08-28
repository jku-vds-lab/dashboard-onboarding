import React, { useState } from "react";
import "./../onboarding/css/userLevel.css";
import { Link } from "react-router-dom";

interface CellProps {
  isSelected: boolean;
  onClick: () => void;
}
const Cell: React.FC<CellProps> = ({ isSelected, onClick }) => {
  return (
    <div
      className={`cell ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    ></div>
  );
};

function UserLevel() {
  const [selectedX, setSelectedX] = useState<number | null>(null);
  const [selectedY, setSelectedY] = useState<number | null>(null);

  const handleCellClick = (xIndex: number, yIndex: number) => {
    setSelectedX(xIndex);
    setSelectedY(yIndex);
    console.log("x: ", xIndex, "y: ", yIndex);
  };

  const xAxisLabels = ["Domain Expertise: Low", "Medium", "High"];
  const yAxisLabels = ["Vis Expertise: Low", "Medium", "High"];

  return (
    <div className="userLevel">
      <Link to="/">
        <div className="btn btn-secondary btn-dark ms-2">Launch Onboarding</div>
      </Link>
      <div className="matrix">
        <div className="labels-row">
          <div className="empty-label"></div>
          {xAxisLabels.map((label, index) => (
            <div className="axis-label" key={index}>
              {label}
            </div>
          ))}
        </div>
        {Array.from({ length: 3 }, (_, yIndex) => (
          <div className="row" key={yIndex}>
            <div className="axis-label">{yAxisLabels[yIndex]}</div>
            {Array.from({ length: 3 }, (_, xIndex) => (
              <Cell
                key={`${xIndex}-${yIndex}`}
                isSelected={xIndex === selectedX && yIndex === selectedY}
                onClick={() => handleCellClick(xIndex, yIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
export default UserLevel;
