class TreeNode {
  constructor(storyNode) {
    this.id = storyNode.id;
    this.absPos = storyNode.pos;
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

function testme(props) {
  try {
    debugger;
    let storyNodes = props.nodes;
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
  // props.nodes.foreach((node) => {
  //   // TreeNode().add(node);
  //   console.log("Node: ", node);
  // });

  // props.nodes
  // extract the vis position
  // possible directions: horizontal, vertical
  // compute traversal attribute, 1 if the node is on the leftmost, if it also has an optional node then
  // sorting from top to bottom of the nodes
  // figuring out group nodes
  // figuring out if they are placed adjacent
  // figur

  // what the onboarding wants:
  // id of the visuals in an ordered array,

  return (
    <div
      className="btn btn-secondary btn-sm me-auto"
      onClick={() => testme(props)}
    >
      Save my changes
    </div>
  );
}
