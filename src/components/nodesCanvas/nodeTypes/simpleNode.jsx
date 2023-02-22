import {Position} from "reactflow";

const SimpleNode = ({data}) => {
    return (
        <div className={`simple-node ${data.type}`}>
            <div className={`header`}>
                <p className="title">{data?.title ?? "Title"}</p>
            </div>
        </div>
    );
};

export default SimpleNode;
