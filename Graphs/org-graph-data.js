

const MAIN_NODE_SIZE = 40; 
const CHILD_NODE_SIZE = 15;
const LEAF_NODE_SIZE = 5;
const DEFAULT_DISTANCE = 40;
const LEAFT_NODE_DISTANCE = 20; 
export const MANY_BODY_STRENGTH = -20;

export const nodes = [];
export const links = [];

const addMainNode = (node, color = 'plum') => {
  node.size = MAIN_NODE_SIZE;
  node.color = color;
  nodes.push(node)
}

const addChildNode = (parentNode, childNode, size = CHILD_NODE_SIZE, distance=DEFAULT_DISTANCE) => {
  childNode.size = size;
  nodes.push(childNode)
  links.push({ 
    source: parentNode, 
    target: childNode,
    distance: distance
  })
}

const assembleChildNode = (parentNode, id, numLeaves = 20) => {
  const childNode = { id: id }
  addChildNode(parentNode, childNode)
  // add the leaf notes 
  for (let i = 0; i < numLeaves; i ++) {
    addChildNode(childNode, { id: '' }, LEAF_NODE_SIZE, LEAFT_NODE_DISTANCE)
  }
};

const connectMainNodes = (source, target) => {
  links.push(
    { 
      source: source, 
      target: target, 
      distance: DEFAULT_DISTANCE 
    }
  )
}

/// Create the nodes programatically 

const artsWeb = { id: "Arts Web" }
addMainNode(artsWeb)
assembleChildNode(artsWeb, "Community Vision")
assembleChildNode(artsWeb, "Silicon Valley Creates")

const socialImpactCommons = { id: "Social Impact Commons" }
addMainNode(socialImpactCommons)
assembleChildNode(socialImpactCommons, "Theatre Bay Area")
assembleChildNode(socialImpactCommons, "EastSide Arts Alliance")
assembleChildNode(socialImpactCommons, "Local Colour")

const communityArts = { id: "Community Arts Stabilisation Trust" }
addMainNode(communityArts)
assembleChildNode(communityArts, "CounterPulse")
assembleChildNode(communityArts, "LuggageStoreGallery")
assembleChildNode(communityArts, "Performing Arts Workshop")
assembleChildNode(communityArts, "447 Minna St.", 5)
assembleChildNode(communityArts, "Keeping Space Oakland")


connectMainNodes(artsWeb, socialImpactCommons);
connectMainNodes(artsWeb, communityArts);
connectMainNodes(socialImpactCommons, communityArts);





