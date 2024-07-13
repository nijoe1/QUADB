import React from "react";
import { Box, Tabs, TabList, TabPanels, TabPanel, Tab } from "@chakra-ui/react";
import Profile from "@/components/profile/Profile";
import UserInstances from "@/components/pages/UserInstances";
import UserCodes from "@/components/ui/UserCodes";
const ProfilePage = () => {
  return (
    <div className="mt-2 max-w-[1180px] mx-auto">
      <Box
        bg="#333333"
        className="flex flex-col items-center "
        borderRadius="md"
        boxShadow="md"
        mb={4}
        p={["2", "4"]}
      >
        <Profile onProfile={true} />

        <Tabs
          isFitted
          variant="enclosed"
          className="text-white"
          minWidth={["150px", "200px"]}
          colorScheme="white"
          mb="4"
        >
          {" "}
          <TabList mb="4">
            <Tab>Datasets</Tab>
            <Tab>Created Codes</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Box minHeight="200px" overflow="auto">
                <UserInstances />
              </Box>
            </TabPanel>
            <TabPanel>
              <Box minHeight="200px" overflow="auto">
                <UserCodes />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </div>
  );
};

export default ProfilePage;
