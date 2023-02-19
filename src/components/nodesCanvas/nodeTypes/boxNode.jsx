import {Handle, Position} from "reactflow";

const BoxNode = ({data}) => {
    return (
        <div className="box-node">
            <div className={`header ${data.type}`}>
                <p className="title">{data?.title ?? "Title"}</p>
            </div>

           <Handle
                id="input-1"
                type="target" // target | source
                position={Position.Left}
                style={{top: "25%", left: "-4px"}}
            />
            <Handle
                id="input-2"
                type="target" // target | source
                position={Position.Left}
                style={{top: "33%", left: "-4px"}}
            />
            <Handle
                id="input-3"
                type="target" // target | source
                position={Position.Left}
                style={{top: "41%", left: "-4px"}}
            />
            <Handle
                id={"output-1"}
                type={"source"}
                position={Position.Right}
                style={{top: "25%", right: "-4px"}}
            />
            <Handle
                id={"output-2"}
                type={"source"}
                position={Position.Right}
                style={{top: "33%", right: "-4px"}}
            />
            <Handle
                id={"output-3"}
                type={"source"}
                position={Position.Right}
                style={{top: "41%", right: "-4px"}}
            />

            <Handle
                id={"output-4"}
                type={"source"}
                position={Position.Bottom}
            />

        </div>
    );
};

export default BoxNode;
