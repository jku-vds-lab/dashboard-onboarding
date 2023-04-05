class TreeNode {
  constructor(storyNode) {
    this.id = storyNode.id;
    this.absPos = storyNode.position;
    this.children = [];
    this.parent = null;
    this.root = null;
    this.IsOptional = false;
  }

  add(treeNode) {
    try {
      if (!this.root) {
        this.root = treeNode;
        this.parent = treeNode;
      }

      this.parent = this.findParent(treeNode);
      treeNode.parent = this.parent;
      if (treeNode.parentId) {
        treeNode.IsOptional = false;
      }
    } catch (error) {
      console.log("Error in adding node", error);
    }

    return treeNode;
  }

  findParent(treeNode) {
    let tParent = this.parent;
    try {
      let tNode = this.root;

      //currently this is an infinite loop
      while (tNode) {
        if (tNode.id == treeNode.id) {
          break;
        }
        tParent = tNode; // this will be the last node
      }
    } catch (error) {
      console.log("Error in finding parent: ", error);
    }
    return { tParent };
  }
}

function compare(elem1, elem2) {
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

function testme(props) {
  try {
    debugger;
    let storyNodes = props.nodes;
    console.log("Nodes initially", storyNodes);
    let newstoryNodes = storyNodes.sort(compare);
    console.log("Nodes finally", newstoryNodes);
    if (storyNodes.length > 0) {
      for (let i = 0; i < storyNodes.length; i++) {
        const tNode = new TreeNode(storyNodes[i]);
        const aNode = tNode.add(tNode);
        console.log(aNode);
      }
    }
  } catch (error) {
    console.log("Error: ", error);
  }
}

export default function Traversal(props) {
  return (
    <div
      className="btn btn-secondary btn-sm me-auto"
      onClick={() => testme(props)}
    >
      Save my changes
    </div>
  );
}
