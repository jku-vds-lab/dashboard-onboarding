import React, { useState } from "react";
import "./../assets/css/userLevel.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ExpertiseLevel, Level } from "../redux/expertise";

import { decrement } from "../redux/expertise";
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
  // redux starts
  const dispatch = useDispatch();
  // redux  ends
  const [selectedX, setSelectedX] = useState<number | null>(1);
  const [selectedY, setSelectedY] = useState<number | null>(1);

  const handleCellClick = (xIndex: number, yIndex: number) => {
    setSelectedX(xIndex);
    setSelectedY(yIndex);

    const expertise: ExpertiseLevel = {
      Domain: Level.Medium,
      Vis: Level.Medium,
    };

    if (xIndex == 0) {
      expertise.Domain = Level.Low;
    }
    if (xIndex == 1) {
      expertise.Domain = Level.Medium;
    }
    if (xIndex == 2) {
      expertise.Domain = Level.High;
    }

    if (yIndex == 0) {
      expertise.Vis = Level.Low;
    }
    if (yIndex == 1) {
      expertise.Vis = Level.Medium;
    }
    if (yIndex == 2) {
      expertise.Vis = Level.High;
    }

    dispatch(decrement(expertise));
  };

  const xAxisLabels = ["Domain Expertise: Low", "Medium", "High"];
  const yAxisLabels = ["Vis Expertise: Low", "Medium", "High"];

  return (
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
  );
}
export default UserLevel;
