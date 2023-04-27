import { TraversalElement, findTraversalVisual } from "../../onboarding/ts/traversal";

function buildTraversal(traversal: TraversalElement[]){    
    let position = reactFlowInstance.project({
      x: 0,
      y: 0,
    });

    for(const elem of traversal){
        let visTitle = getTitle(elem);
        const newNode = {
            id: getID(elem),
            type: "simple",
            position,
            data: {
              title: visTitle,
              type: visTitle,
            },
          };
          
        setNodes((nds) => nds.concat(newNode));
        position.y -= 10;
    } 
}

function getID(elem: TraversalElement){
    let id = elem.element.id;
    if(elem.categories.length === 1 && elem.categories[0] === "insight"){
        id += " Insight";
    }else if(elem.categories.length === 1 && elem.categories[0] === "interaction"){
        id += " Interaction";
    }

    return id; 
}

function getTitle(elem: TraversalElement){
    let visTitle = "";
    switch(elem.element.id){
        case "dashboard":
            visTitle = "dashboard";
            break;
        case "globalFilters":
            visTitle = "globalFilters";
            break;
        default:
            let vis = findTraversalVisual(elem.element.id);
            visTitle = createNodeTitle(vis.type);
            const itemLength = checkDuplicateComponents(vis.type);
            if (itemLength > 1) {
                visTitle = visTitle + " (" + vis.title + ")";
            }
    }
    return visTitle;
}