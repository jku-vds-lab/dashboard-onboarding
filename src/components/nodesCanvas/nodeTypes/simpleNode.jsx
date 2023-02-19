import {Position} from "reactflow";

const SimpleNode = ({data}) => {
    return (
        <div className="simple-node">
            <div className={`header ${data.type}`}>
                <p className="title">{data?.title ?? "Title"}</p>
            </div>
        </div>
    );
};

export default SimpleNode;
