import ICustomNode from "./ICustomNode";
export default function SimpleNodeDiv(customNode: ICustomNode) {
  return (
    <div className={`node simple-node ${customNode.type}`}>
      <div className={`header`}>
        <p className="title">{customNode?.data.title ?? "Untitled"}</p>
      </div>
    </div>
  );
}
