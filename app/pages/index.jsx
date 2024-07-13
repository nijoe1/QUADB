import React, { use, useEffect, useState } from "react";
import InstanceDetailsPage from "@/components/pages/instance";
import SingleSpacePage from "@/components/pages/SpaceInstances";
import LandingPage from "@/components/pages/LandingPage";
import ProfilePage from "@/components/pages/ProfilePage";
import SpacesGraph from "@/components/pages/SpacesGraph";
import Voting from "@/components/pages/voting";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();

  useEffect(() => {}, [router.asPath]);

  return (
    <div>
      {router.asPath === "/#/spaces" && <SpacesGraph />}
      {router.asPath.includes("/#/profile") && <ProfilePage />}
      {(router.asPath === "/#/" ||
        (router.pathname === "/" && router.asPath === "/")) && <LandingPage />}
      {router.asPath.includes("/#/SingleSpacePage") && <SingleSpacePage />}
      {router.asPath.includes("/#/instance") && <InstanceDetailsPage />}
      {router.asPath.includes("/#/voting") && <Voting />}
    </div>
  );
};

export default Home;
