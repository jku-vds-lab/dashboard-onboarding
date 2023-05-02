import Node from "reactflow";
export default interface ICustomNode {
  id: string;
  type: string;
  position: { x: any; y: any };
  data: {
    title: string;
    type: string;
    callback?: any;
    traverse?: string;
  };
  zIndex?: number;
  parentNode: any;
  className?: string;
  style?: { width: number; height: number };
}
