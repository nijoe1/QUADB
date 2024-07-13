import React, { useState, useEffect } from "react";
import { Box, Flex, Select, useDisclosure } from "@chakra-ui/react";
import { Container } from "@/components//ui/container";
import Tree from "react-d3-tree";
import { useRouter } from "next/router";
import CreateSubSpaceModal from "@/components/contracts/createSubSpace";
import { constructObject } from "@/utils/tableland";
import Loading from "@/components/Animation/Loading";

const SpacesGraph = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [treeData, setTreeData] = useState(null);
  const [tempTreeData, setTempTreeData] = useState(null);
  const [fetched, setFetched] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState();
  const [windowDimensions, setWindowDimensions] = useState({
    width: undefined,
    height: undefined,
  });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isRoot, setIsRoot] = useState();
  const [clickedID, setClickedID] = useState();

  const navigateToHashRoute = (hashRoute) => {
    if (hashRoute == "/") {
      router.push({
        pathname: hashRoute,
      });
    } else {
      router.push({
        pathname: "",
        hash: hashRoute,
      });
    }
  };
  useEffect(() => {}, [isRoot, clickedID]);
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener to update window dimensions on resize
    window.addEventListener("resize", handleResize);

    // Initial call to set window dimensions
    handleResize();

    // Remove event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Generate tree data for the selected category or entire tree if no category is selected
    generateTreeData();
  }, []);

  useEffect(() => {
    // Generate tree data for the selected category or entire tree if no category is selected
    generateTreeData(selectedCategory);
  }, [selectedCategory]);

  // Generate tree data for the selected category or entire tree if no category is selected
  const generateTreeData = async (selectedCategory) => {
    // If a category is selected, find its subtree and return it
    if (selectedCategory) {
      setTreeData(findCategoryNode(tempTreeData, selectedCategory));
    } else {
      // Replace this with your actual data for the "QUADB.eth" category
      const exampleData = await constructObject();

      // Extract immediate children of the root node as categories
      const categories = exampleData.children.map(
        (child) => child.name.split(".")[0]
      );

      // Set categories as options
      setCategoryOptions(
        categories.map((category) => ({ value: category, label: category }))
      );
      // If no category is selected, return the entire tree data
      // return exampleData;
      setTreeData(exampleData);
      setTempTreeData(exampleData);
      setFetched(true);
    }
  };

  // Function to find the node for the selected category
  const findCategoryNode = (data, category) => {
    const categoryNode = { ...data };
    categoryNode.children = categoryNode.children.filter(
      (child) => child.name.split(".")[0] === category
    );
    return categoryNode;
  };

  // Define custom styles for different node types
  const nodeStyles = {
    root: { fill: "#424242", stroke: "#000", strokeWidth: "2px" },
    branch: { fill: "#727272", stroke: "#000", strokeWidth: "2px" },
    leaf: { fill: "#ecf1f6", stroke: "#000", strokeWidth: "2px" },
  };

  // Handle click event on the label to navigate to the spaces page
  const handleLabelClick = (name) => {
    // Implement navigation logic here, for example:
    if (name.attributes?.nodeType !== "root") {
      navigateToHashRoute(`/SingleSpacePage?id=${name.id}`);
    }
  };

  // Handle click event on the circle to toggle nodes
  const handleCircleClick = (nodeDatum, toggleNode) => {
    toggleNode();
  };

  const handleNewClick = (nodeDatum, toggleNode) => {
    setIsRoot(nodeDatum.attributes.nodeType == "root");
    setClickedID(nodeDatum.id);
    onOpen();
  };

  // Custom node and label rendering function
  const renderCustomNodeElement = ({ nodeDatum, toggleNode }) => (
    <g>
      <circle
        r="15"
        style={nodeStyles[nodeDatum.attributes?.nodeType]}
        onClick={() => handleCircleClick(nodeDatum, toggleNode)}
      />
      <text
        fill="black"
        strokeWidth="1"
        x="20"
        y="-2"
        onClick={() => handleLabelClick(nodeDatum)}
        style={{ cursor: "pointer" }}
      >
        {nodeDatum.name}
      </text>
      {(
        <g>
          {" "}
          <rect
            x="30"
            y="4"
            width="40"
            height="20"
            rx="5"
            fill="gray"
            stroke="black"
            strokeWidth="1"
            onClick={() => handleLabelClick(nodeDatum)}
            style={{ cursor: "pointer" }}
          />
          <text
            fill="black"
            strokeWidth="1"
            x="50"
            y="15"
            textAnchor="middle"
            alignmentBaseline="middle"
            onClick={() => handleNewClick(nodeDatum)}
            style={{ cursor: "pointer" }}
          >
            {"new"}
          </text>
        </g>
      )}
    </g>
  );

  return (
    <div className="flex flex-col items-center">
      {!fetched ? (
        <div className="mx-auto mt-[10%]">
          <Loading />
        </div>
      ) : (
        <Container>
          <Box
            borderWidth="1px"
            borderColor={"black"}
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            height="calc(100vh - 150px)" // Adjust height dynamically
            display="flex"
            alignItems="center"
          >
            <Flex
              direction="column"
              align="center"
              justify="center"
              height="100%"
              width="100%"
            >
              {/* Category dropdown */}
              <Select
                placeholder="All categories..."
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                mb={4}
                mt="6%"
                width={["90%", "70%", "50%"]} // Adjust width for different screen sizes
                _focus={{
                  borderColor: "white",
                }}
              >
                {categoryOptions.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </Select>
              {/* Display tree */}
              {treeData && (
                <Box
                  id="treeWrapper"
                  width="100%"
                  height="calc(100vh - 250px)" // Adjust height dynamically
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Tree
                    data={treeData}
                    orientation="vertical"
                    rootNodeClassName="node__root"
                    branchNodeClassName="node__branch"
                    leafNodeClassName="node__leaf"
                    renderCustomNodeElement={renderCustomNodeElement}
                    translate={{
                      x: windowDimensions.width / 2.8,
                      y: windowDimensions.height / 7,
                    }}
                    zoom={1}
                    separation={{ siblings: 2, nonSiblings: 2 }}
                    initialDepth={1}
                  />
                </Box>
              )}
            </Flex>
            <CreateSubSpaceModal
              isOpen={isOpen}
              onClose={onClose}
              isRoot={isRoot}
              clickedID={clickedID}
            />
          </Box>
        </Container>
      )}
    </div>
  );
};

export default SpacesGraph;
