"use client";
import React, { useState } from "react";
import { Container } from "@/app/components/UI/container";
import Logo from "@/app/components/Menu/NavbarLogo";
import NavLinks, { NavLinksResponsive } from "@/app/components/Menu/NavLinks";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar(): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Container className="bg-black/80 rounded-md mt-4">
      <nav
        className={`flex w-full mx-auto md:justify-between lg:grid lg:px-3 relative ${!true ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}
      >
        <div className="absolute top-0 bottom-0 md:static flex items-center">
          <div className="lg:hidden">
            <button className="p-1 text-primary" onClick={toggleSidebar}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-menu-2"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="3"
                stroke="#f0f0f0"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 6l16 0" />
                <path d="M4 12l16 0" />
                <path d="M4 18l16 0" />
              </svg>
            </button>
            <div className={isSidebarOpen ? "" : "hidden"}>
              <NavLinksResponsive
                isConnected={true}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            </div>
          </div>
          <div className="hidden md:block">
            <Logo />
          </div>
        </div>
        <div className="grow md:hidden flex justify-center">
          <Logo />
        </div>
        <NavLinks />
        <div className="hidden md:flex items-center justify-end gap-2">
          <ConnectButton showBalance={true} chainStatus={"icon"} />
        </div>
      </nav>
    </Container>
  );
}
