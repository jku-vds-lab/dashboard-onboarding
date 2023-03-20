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
      debugger;
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
      debugger;

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
  debugger;
  if (elem1.position.x < elem2.position.x) {
    return -1;
  }
  if (elem1.position.x > elem2.position.x) {
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
  return 1;
}

function testme(props) {
  try {
    let storyNodes = props.nodes;
    console.log("Nodes initially", storyNodes);
    debugger;
    let newstorynodes = storyNodes.sort(compare);
    console.log("Nodes finally", newstorynodes);
    debugger;
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
