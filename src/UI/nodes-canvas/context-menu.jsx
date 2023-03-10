import React, {useState, useEffect, memo} from "react";

export const ContextMenu = memo(
    ({isOpen, position, actions = [], onMouseLeave}) =>
        isOpen ? (
            <div className="context-menu" onMouseLeave={onMouseLeave}
                 style={{
                     position: 'absolute',
                     left: position.x,
                     top: position.y,
                 }}>
                {
                    actions.map((action)=>(
                        <div className="menu-item" key={action.label} onClick={action.effect}>
                            {action.label}
                        </div>
                    ))
                }
            </div>
        ) : null
);
