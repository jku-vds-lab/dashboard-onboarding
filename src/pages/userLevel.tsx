import React, { useState } from "react";
import "./../onboarding/css/userLevel.css";
import Draggable from "react-draggable";
import { Link } from "react-router-dom";

interface CellProps {
  expertise: string;
  onDrop: (expertise: string) => void;
}

const Cell: React.FC<CellProps> = ({ expertise, onDrop }) => {
  const handleDrop = (droppedExpertise: string) => {
    onDrop(droppedExpertise);
  };

  return (
    <div className={`cell ${expertise}`}>
      <Draggable onStop={() => handleDrop(expertise)}>
        <button className={`draggable-button`}>{expertise}</button>
      </Draggable>
    </div>
  );
};

function UserLevel() {
  const [matrixData, setMatrixData] = useState<string[]>([
    "low low",
    "low medium",
    "low high",
    "medium low",
    "medium medium",
    "medium high",
    "high low",
    "high medium",
    "high high",
  ]);

  const handleCellDrop = (droppedExpertise: string) => {
    const newData = matrixData.slice();
    // const draggedIndex = newData.indexOf(draggedExpertise);
    const dropIndex = newData.indexOf(droppedExpertise);

    // newData[draggedIndex] = droppedExpertise;
    newData[dropIndex] = droppedExpertise;

    setMatrixData(newData);
  };

  return (
    <div className="userLevel">
      <Link to="/">
        <div className="btn btn-secondary btn-dark ms-2">Launch Onboarding</div>
      </Link>
      <div className="matrix">
        {matrixData.map((expertise, index) => (
          <Cell key={index} expertise={expertise} onDrop={handleCellDrop} />
        ))}
      </div>
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
