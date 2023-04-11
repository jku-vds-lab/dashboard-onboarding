class TraversalOrder {
  simpleNodes = [];
  groupNodes = [];
  groupElementsCount = [];
  simpleNode = {};

  constructor() {
    this.simpleNodes = [];
    this.groupNodes = [];
    this.groupElementsCount = [];
    this.simpleNode = {
      id: "",
      type: "",
      position: {},
      data: {},
      rank: 0,
      probability: 0,
      position: { x: 0, y: 0 },
      parentGroup: null,
      parentGroupCategory: null,
    };
  }

  setGroupNodes(storyNodes) {
    this.groupNodes = storyNodes.filter((sNode) => sNode.type == "group");
  }

  setSimpleNodes(simpleStoryNode, groupNode) {
    this.simpleNode = {
      ...simpleStoryNode,
      rank: 0,
      probability: 0,
      parentGroup: groupNode,
      parentGroupCategory: groupNode?.data?.traverse,
    };

    this.simpleNodes.push(this.simpleNode);
  }

  setGroupElementsCount() {
    this.groupNodes.forEach((gNode) => {
      this.groupElementsCount.push({ id: gNode.id, count: 0 });
    });
  }

  setProbability() {
    // for each node, check if it is a group node
    // if yes, what is the group element count
    // based on that, what is the group category
    // based on that, assign probability
    // next level of complication will be the position
    debugger;
    console.log(this.simpleNodes);
  }

  setRank() {}

  onClick(props) {
    try {
      let storyNodes = props.nodes;
      let simpleStoryNodes = [];

      if (storyNodes.length > 0) {
        this.setGroupNodes(storyNodes);

        this.setGroupElementsCount();

        simpleStoryNodes = storyNodes.filter((sNode) => sNode.type == "simple");

        for (let i = 0; i < simpleStoryNodes.length; i++) {
          let parentId = simpleStoryNodes[i].parentNode;
          let groupNode = null;

          if (parentId?.includes("group")) {
            groupNode = this.groupNodes.find((gNode) => gNode.id == parentId);

            this.groupElementsCount.map((gElemCount) => {
              if (gElemCount.id == groupNode.id) {
                gElemCount.count++;
              }
            });
          }
          this.setSimpleNodes(simpleStoryNodes[i], groupNode);
        }
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  compare(elem1, elem2) {
    // -1: elem1 then elem2
    // 1: elem2 then elem1
    // 0: elem1 = elem 2
    //sort based on x pos first.

    // if x1 < x2 then first x1 then x2 (child or next in sequence)
    // if y1 = y2 then elem 1 and elem 2 are the same, return 0, because it is optional
    // if y1 < or > y2 then elem 1 and then elem2, because elem 2 is a child, return -1

    // if x1 > x2 then first x2 then x1
    //

    if (elem1.position.x < elem2.position.x) {
      if (elem1.position.y == elem2.position.y) {
        return 0;
      }
      return -1;
    }
    if (elem1.position.x > elem2.position.x) {
      if (elem1.position.y == elem2.position.y) {
        return 0;
      }
      return 1;
    }
    if (elem1.position.x == elem2.position.x) {
      if (elem1.position.y < elem2.position.y) {
        return -1;
      }
      if (elem1.position.y > elem2.position.y) {
        return 1;
      }
      if (elem1.position.y == elem2.position.y) {
        return 0;
      }
    }
    return 0;
  }
}

// function testme(props) {
//   try {
//     let storyNodes = props.nodes;
//     let groupElementsCount = [];

//     if (storyNodes.length > 0) {
//       let groupNodes = storyNodes.filter((sNode) => sNode.type == "group");

//       groupNodes.forEach((gNode) => {
//         groupElementsCount.push({ id: gNode.id, count: 0 });
//       });
//       let simpleNodes = storyNodes.filter((sNode) => sNode.type == "simple");

//       for (let i = 0; i < simpleNodes.length; i++) {
//         let parentId = simpleNodes[i].parentNode;
//         let groupNode = null;

//         if (parentId?.includes("group")) {
//           groupNode = groupNodes.find((gNode) => gNode.id == parentId);

//           groupElementsCount.map((gElemCount) => {
//             if (gElemCount.id == groupNode.id) {
//               gElemCount.count++;
//             }
//           });
//         }
//         const aNode = new StoryNode(simpleNodes[i], groupNode);
//         console.log(aNode);
//       }

//       // send the group elements count to the class
//       // calculate initial probability
//       // calculate initial rank
//     }

//     // start here
//     // setInitialProbability

//     console.log("GroupElementsCount", groupElementsCount);

//     // let newstoryNodes = storyNodes.sort(compare);
//     // console.log("Nodes finally", newstoryNodes);
//   } catch (error) {
//     debugger;
//     console.log("Error: ", error);
//   }
// }

export default function Traversal(props) {
  let sNode = new TraversalOrder();

  return (
    <div
      className="btn btn-secondary btn-sm me-auto"
      onClick={() => sNode.onClick(props)}
    >
      Save my changes
    </div>
  );
}
