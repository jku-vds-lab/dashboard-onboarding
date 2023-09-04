import React, { CSSProperties, MouseEvent } from "react";
import { getCardStyle, StyleProps } from "./style";

type DivAttributes = {
  id: string;
  categories: string[];
  count: number;
  margin: StyleProps;
  classes: string;
  content: string;
  role: string;
  label: string;
  clickable: boolean;
  selectedTargets?: Record<string, any>;
  eventType?: string;
  eventFunction?: (e: MouseEvent) => void;
  parentId: string;
};

export default function Card(props: DivAttributes) {
  return (
    <div
      id={props.id}
      style={getCardStyle(props.margin)}
      className={props.classes}
      role={props.role}
      aria-labelledby={props.label}
      onClick={props.eventType === "click" ? props.eventFunction : undefined}
    >
      {props.content}
    </div>
  );
}
