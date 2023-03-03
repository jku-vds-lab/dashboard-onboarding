import {getBezierPath} from 'reactflow';

const Path = ({
                  id,
                  sourceX,
                  sourceY,
                  targetX,
                  targetY,
                  sourcePosition,
                  targetPosition,
                  style = {},
                  data
              }) => {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    //assigning color to the initial edges
    const nodeSource = document.querySelector('[data-id="node-'+data.n_source+'"]');
    const nodeTarget = document.querySelector('[data-id="node-'+data.n_target+'"]');
    let outputHandle = nodeSource.querySelector('[data-handleid="output-'+data.h_output+'"]');
    let inputHandle = nodeTarget.querySelector('[data-handleid="input-'+data.h_input+'"]');
    outputHandle.style.background = ""+data.color;
    inputHandle.style.background = ""+data.color;

    return (
        <>
            <path
                id={id}
                className={`react-flow__edge-path ${data.class}`}
                d={edgePath}
                style={{stroke: `${data.color}`}}
            />
        </>
    );
};

export default Path;
