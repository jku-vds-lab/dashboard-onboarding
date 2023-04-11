class TraversalOrder {
  simpleNodes = [];
  groupNodes = [];
  groupElementsCount = [];
  simpleNode = {};
  grpCat1 = "All";
  grpCat2 = "At least one";
  grpCat3 = "Only one";

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
      pGrpCnt: 0,
      pGrp: null,
      pGrpCat: null,
    };
    this.groupNode = {
      id: "",
      type: "",
      position: {},
      data: {},
      elementCount: 0,
    };
  }

  setGroupNodesAndElementsCount(storyNodes) {
    this.groupNodes = storyNodes.filter((sNode) => sNode.type == "group");
    this.groupNodes.forEach((gNode) => {
      this.groupElementsCount.push({ id: gNode.id, count: 0 });
    });
    this.simpleNodes.forEach((sNode) => {
      if (sNode.pGrp) {
        this.groupElementsCount.map((gElem) => {
          if (gElem.id == sNode.pGrp.id) {
            gElem.count++;
          }
        });
      }
    });
  }

  setSimpleNodes(simpleStoryNode, groupStoryNode) {
    this.simpleNode = {
      ...simpleStoryNode,
      rank: 0,
      probability: 0,
      pGrpCnt: 0,
      pGrp: groupStoryNode,
      pGrpCat: groupStoryNode?.data?.traverse,
    };

    this.simpleNodes.push(this.simpleNode);
  }

  setGrpCnt() {
    this.simpleNodes.map((sNode) => {
      if (sNode.pGrp) {
        let elem = this.groupElementsCount.find(
          (gElem) => gElem.id == sNode.pGrp.id
        );
        sNode.pGrpCnt = elem.count;
      }
    });
  }

  setProb() {
    this.simpleNodes.forEach((sNode) => {
      if (sNode.pGrp) {
        if (sNode.pGrpCat == this.grpCat1) {
          sNode.probability = 1;
        } else {
          sNode.probability = 1 / sNode.pGrpCnt;
        }
      }
    });
  }

  setRank() {
    // sort simple nodes by y- position
    // if they are of the same y-position, check if they are in the same group, assign rank based on x position
    //
    try {
      this.simpleNodes = this.simpleNodes.sort(this.compare);
      console.log(this.simpleNodes);
    } catch (error) {
      console.log("Error", error);
    }
  }

  compare(elem1, elem2) {
    // -1: elem1 then elem2
    // 1: elem2 then elem1
    // 0: elem1 = elem 2
    // simpleNodes with parents have positionm absolute, while others don't
    try {
      let yPos1 = elem1.positionAbsolute
        ? elem1.positionAbsolute.y
        : elem1.position.y;
      let yPos2 = elem2.positionAbsolute
        ? elem2.positionAbsolute.y
        : elem2.position.y;

      if (yPos1 < yPos2) {
        return -1;
      } else if (yPos1 > yPos2) {
        return 1;
      } else {
        return 0;
      }
    } catch (error) {
      console.log("Error", error);
    }
    return 0;
  }

  updateRank() {
    this.simpleNodes.forEach((sNode) => {
      if (sNode.pGrp) {
        if (sNode.pGrpCat == this.grpCat1) {
          sNode.probability = 1;
        } else {
          sNode.probability = 1 / sNode.pGrpCnt;
        }
      }
    });
  }

  updateProb() {
    // Get the information from what was clicked by the user
    // based on that, set the probabilities of others accordingly
    // old nodes can simply be discarded
    this.simpleNodes.forEach((sNode) => {
      if (sNode.pGrp) {
        if (sNode.pGrpCat == this.grpCat1) {
          sNode.probability = 1;
        } else {
          sNode.probability = 1 / sNode.pGrpCnt;
        }
      }
    });
  }

  onClick(props) {
    try {
      let storyNodes = props.nodes;
      let simpleStoryNodes = [];
      let groupStoryNodes = [];

      if (storyNodes.length > 0) {
        simpleStoryNodes = storyNodes.filter((sNode) => sNode.type == "simple");
        groupStoryNodes = storyNodes.filter((sNode) => sNode.type == "group");

        simpleStoryNodes.forEach((sNode) => {
          let parentId = sNode.parentNode;
          let groupStoryNode = null;

          if (parentId?.includes("group")) {
            groupStoryNode = groupStoryNodes.find(
              (gNode) => gNode.id == parentId
            );
          }

          this.setSimpleNodes(sNode, groupStoryNode);
        });
      }

      this.setGroupNodesAndElementsCount(storyNodes);
      this.setGrpCnt();
      this.setProb();
      this.setRank();
    } catch (error) {
      console.log("Error: ", error);
    }
  }
}

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
