import React, { useState } from "react";
import "./../onboarding/css/userLevel.css";
import { Link } from "react-router-dom";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
  };

  return (
    <div className="matrix">
      {Array.from({ length: 3 }, (_, yIndex) => (
        <div className="row" key={yIndex}>
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
  );
}
export default UserLevel;

// <div className="userLevel">
// <Link to="/">
//   <div className="btn btn-secondary btn-dark ms-2">Launch Onboarding</div>
// </Link>
// <div className="matrix">
//   {matrixData.map((expertise, index) => (
//     <Cell key={index} expertise={expertise} onDrop={handleCellDrop} />
//   ))}
// </div>
// </div>
