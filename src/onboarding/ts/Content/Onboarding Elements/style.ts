export type StyleProps = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export function getCardStyle({
  top,
  left,
  width,
  height,
}: StyleProps): React.CSSProperties {
  return {
    ...getClickableStyle({ top, left, width, height }),
    borderRadius: 10,
    backgroundColor: "lightsteelblue",
    zIndex: 99,
  };
}

export function getClickableStyle({
  top,
  left,
  width,
  height,
}: StyleProps): React.CSSProperties {
  return {
    position: "absolute",
    pointerEvents: "auto",
    top: top,
    left: left,
    width: width,
    height: height,
  };
}
