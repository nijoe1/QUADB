"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Image,
  Badge,
} from "@chakra-ui/react";
import { NotebookPreviewer } from "@/components/NotebookPreviewer";
import { Button } from "@/primitives/Button";

const CodeViewer = ({ code, onClose }: { code: any; onClose: () => void }) => {
  const toast = useToast();
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (index: any) => {
    setTabIndex(index);
  };

  const handleToDo = () => {
    toast({
      title: "Comming soon sir 🚀",
      status: "warning",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box
      width="100%"
      maxWidth="1000px"
      mx="auto"
      borderRadius="md"
      p={4}
      overflow="auto"
      boxShadow="lg"
    >
      {/* Code creator profile */}
      <Box mb={4} className="text-white">
        <div className="flex flex-wrap items-center gap-2 p-3">
          <Text fontWeight="bold">Code Creator :</Text>

          <Text>{"creator"}</Text>
          <Image width={25} src={"ode.profile.picture"} borderRadius="lg" />
          <Badge
            className="bg-black text-black"
            borderRadius="full"
            fontSize="sm"
            cursor={"pointer"}
            onClick={() => {}}
          >
            {`${code.creator?.slice(0, 6)}...${code.creator?.slice(-6)}`}
          </Badge>
          <Text>{code.desc}</Text>
          {/* Add avatar here if available */}
        </div>
      </Box>

      {/* Tabs for notebook, discussions, input dataset, and output */}
      <Tabs
        isFitted
        variant="enclosed"
        className="text-white"
        index={tabIndex}
        onChange={handleTabChange}
        colorScheme="white"
        mb="4"
      >
        <TabList>
          <Tab>Notebook</Tab>
          <Tab>Compute Output</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box maxHeight="500px" overflowY="auto">
              <NotebookPreviewer code={code.codeCID} />
            </Box>
          </TabPanel>

          <TabPanel>
            <div className="flex flex-col items-center p-5 text-center">
              {/* Compute output */}
              <Text
                p={2}
                mb={4}
                background={"white"}
                borderRadius="lg"
                border="1"
                textColor={"black"}
              >
                Compute output with Bacalhau
              </Text>
              <Image src="/images/bacalhau.png" maxHeight="100" />{" "}
              <Button
                className="border-1 mt-4 rounded-lg bg-white text-black"
                onClick={handleToDo}
              >
                Compute Output
              </Button>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default CodeViewer;
