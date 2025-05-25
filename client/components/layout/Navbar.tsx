"use client";
import React, { useState } from "react";
import { Container } from "@/ui-shadcn/container";
import Logo from "@/components/layout/NavbarLogo";
import NavLinks, { NavLinksResponsive } from "@/components/layout/NavLinks";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar(): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Container className="mt-4 rounded-md bg-black/80">
      <nav
        className={`relative mx-auto flex w-full md:justify-between lg:grid lg:px-3 ${!true ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}
      >
        <div className="absolute inset-y-0 flex items-center md:static">
          <div className="lg:hidden">
            <button className="text-primary p-1" onClick={toggleSidebar}>
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
        <div className="flex grow justify-center md:hidden">
          <Logo />
        </div>
        <NavLinks />
        <div className="hidden items-center justify-end gap-2 md:flex">
          <ConnectButton showBalance={true} chainStatus={"icon"} />
        </div>
      </nav>
    </Container>
  );
}
