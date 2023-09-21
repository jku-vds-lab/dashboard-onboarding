import React, { useState, useEffect, memo } from "react";

interface ContextProps {
  isOpen: boolean;
  position: any;
  actions: any;
  onClick: any;
  onMouseLeave: any;
}

export const ContextMenu = memo((props: ContextProps) => {
  return props.isOpen ? (
    <div
      className="context-menu"
      onMouseLeave={props.onMouseLeave}
      style={{
        position: "absolute",
        left: props.position.x,
        top: props.position.y,
      }}
    >
      {props.actions.map((action: any) => (
        <div className="menu-item" key={action.label} onClick={action.effect}>
          {action.label}
        </div>
      ))}
    </div>
  ) : null;
});
