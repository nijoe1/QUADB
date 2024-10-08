"use client";
import React, { useState } from "react";
import { Box, Flex, Select, useDisclosure } from "@chakra-ui/react";
import { Container } from "@/app/components/ui/container";
import Tree from "react-d3-tree";
import { useRouter } from "next/navigation";
import CreateSubSpaceModal from "@/app/components/contracts/createSubSpace";
import Loading from "@/app/components/animation/loading";
import useFetchTreeData from "@/app/hooks/useFetchTreeData"; // Importing the custom hook
import { useWindowDimensions } from "@/app/hooks/useWindowDimensions"; // Importing the window dimensions hook
import { useFetchRootObject } from "@/app/hooks/useFetchRootObject"; // Importing the root object hook
import Link from "next/link";

const SpacesGraph = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState();
  const [windowDimensions, setWindowDimensions] = useState({
    width: undefined,
    height: undefined,
  });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isRoot, setIsRoot] = useState();
  const [clickedID, setClickedID] = useState();

  // Using the custom hooks
  const { fetchTreeData, isLoading: isTreeLoading } =
    useFetchTreeData(setCategoryOptions);
  const { data: rootObject, isLoading: isRootLoading } = useFetchRootObject();
  useWindowDimensions(setWindowDimensions); // Call the window dimensions hook

  // Define the custom node rendering function
  const renderCustomNodeElement = ({ nodeDatum, toggleNode }) => (
    <g>
      <circle
        r="15"
        style={{
          fill:
            nodeDatum.attributes.nodeType === "root"
              ? "#424242"
              : nodeDatum.attributes.nodeType === "branch"
                ? "#727272"
                : "#ecf1f6",
        }}
        onClick={toggleNode}
      />
      <Link href={`/spaces/${nodeDatum.id}`}>
        <text
          fill="black"
          strokeWidth="1"
          x="20"
          y="-2"
          style={{ cursor: "pointer" }}
        >
          {nodeDatum.name}
        </text>
      </Link>
      <g>
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
    </g>
  );

  // Fetch tree data on component mount
  React.useEffect(() => {
    fetchTreeData();
  }, [fetchTreeData]);

  const handleLabelClick = async (nodeDatum) => {
    // Implement navigation logic here, for example:
    if (nodeDatum.attributes?.nodeType !== "root") {
      // Update this path according to your app's routing structure
      router.push(`/spaces/${nodeDatum.id}`);
    }
  };

  const handleNewClick = (nodeDatum, toggleNode) => {
    setIsRoot(nodeDatum.attributes.nodeType == "root");
    setClickedID(nodeDatum.id);
    onOpen();
  };

  return (
    <div className="flex flex-col items-center">
      {isRootLoading || isTreeLoading ? (
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
            height="calc(100vh - 150px)"
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
                width={["90%", "70%", "50%"]}
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
              {rootObject && (
                <Box
                  id="treeWrapper"
                  width="100%"
                  height="calc(100vh - 250px)"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Tree
                    data={rootObject}
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
