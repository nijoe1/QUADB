"use client";

import React, { useState } from "react";
import Tree from "react-d3-tree";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Hex } from "viem";

import Loading from "@/components/animation/loading";
import { useFetchTreeData } from "@/hooks/helpers";
import { useWindowDimensions } from "@/hooks/helpers";
import { useFetchRootObject } from "@/hooks/helpers";
import { Container } from "@/ui-shadcn/container";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui-shadcn/select";

import { CreateSpaceModal } from "./_components/CreateSpaceModal";

const SpacesGraph = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [windowDimensions, setWindowDimensions] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  const [, /* tempTreeData */ setTempTreeData] = useState<any>(null);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isRoot, setIsRoot] = useState(false);
  const [clickedID, setClickedID] = useState<Hex | null>(null);

  const { fetchTreeData, isPending: isTreeLoading } = useFetchTreeData(
    setCategoryOptions,
    selectedCategory,
    setTempTreeData,
  );

  const { data: rootObject, isLoading: isRootLoading } = useFetchRootObject();
  useWindowDimensions(setWindowDimensions); // Call the window dimensions hook

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Define the custom node rendering function
  const renderCustomNodeElement = ({
    nodeDatum,
    toggleNode,
  }: {
    nodeDatum: any;
    toggleNode: any;
  }) => (
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
        <text fill="black" strokeWidth="1" x="20" y="-2" style={{ cursor: "pointer" }}>
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

  const handleLabelClick = async (nodeDatum: any) => {
    // Implement navigation logic here, for example:
    if (nodeDatum.attributes?.nodeType !== "root") {
      // Update this path according to your app's routing structure
      router.push(`/spaces/${nodeDatum.id}`);
    }
  };

  const handleNewClick = (nodeDatum: any) => {
    setIsRoot(nodeDatum.attributes.nodeType == "root");
    setClickedID(nodeDatum.id as Hex);
    handleOpenModal();
  };

  return (
    <div className="flex flex-col items-center">
      {isRootLoading || isTreeLoading ? (
        <div className="mx-auto mt-[10%]">
          <Loading />
        </div>
      ) : (
        <Container>
          <div className="flex h-[calc(100vh-150px)] items-center overflow-hidden rounded-lg border border-black shadow-md">
            <div className="flex size-full flex-col items-center justify-center">
              {/* Category dropdown */}
              <div className="mb-4 mt-[6%] w-[90%] md:w-[70%] lg:w-1/2">
                <Select value={selectedCategory || ""} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full focus:border-white">
                    <SelectValue placeholder="All categories..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category: any) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Display tree */}
              {rootObject && (
                <div
                  id="treeWrapper"
                  className="flex h-[calc(100vh-250px)] w-full items-center justify-center"
                >
                  <Tree
                    data={rootObject}
                    orientation="vertical"
                    rootNodeClassName="node__root"
                    branchNodeClassName="node__branch"
                    leafNodeClassName="node__leaf"
                    renderCustomNodeElement={renderCustomNodeElement}
                    translate={{
                      x: windowDimensions.width ? windowDimensions.width / 2.8 : 0,
                      y: windowDimensions.height ? windowDimensions.height / 7 : 0,
                    }}
                    zoom={1}
                    separation={{ siblings: 2, nonSiblings: 2 }}
                    initialDepth={1}
                  />
                </div>
              )}
            </div>
            <CreateSpaceModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              isRoot={isRoot}
              clickedID={clickedID as Hex}
            />
          </div>
        </Container>
      )}
    </div>
  );
};

export default SpacesGraph;
