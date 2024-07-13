import { useEffect, useState } from "react";
import { Container } from "@/components//ui/container";
import Logo from "@/components/menu/NavbarLogo";
import NavLinks, { NavLinksResponsive } from "@/components/menu/NavLinks";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import StepperForm from "../StepperForm";
import { useAccount, useChainId } from "wagmi";
import { useRouter } from "next/router";

export default function Navbar(): JSX.Element {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { address, isConnected } = useAccount(); // Removed isOpen
  const chainID = useChainId();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changeChain, setChangeChain] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const check = async () => {
      let prevAddress;
      let JWT;
      let API_KEY;
      try {
        prevAddress = localStorage.getItem("prevAddress");
      } catch {}
      try {
        JWT = localStorage.getItem(`lighthouse-jwt-${address}`);
      } catch {}
      try {
        API_KEY = localStorage.getItem(`API_KEY_${address?.toLowerCase()}`);
      } catch {}
      if (address && address != prevAddress && isConnected) {
        localStorage.setItem("prevAddress", address ? address : "".toString());
        localStorage.setItem("prevChain", chainID.toString());
        setChangeChain(false);
        setIsOpen(true);
        openModal();
      } else if (!isOpen && isConnected) {
        setIsOpen(true);
        openModal();
      }
    };
    check();
  }, [address]); // Removed isOpen from dependency array

  useEffect(() => {
    let prevChain;
    let prevAddress;
    try {
      prevAddress = localStorage.getItem("prevAddress");
      prevChain = localStorage.getItem("prevChain");
    } catch {}
    if (prevAddress && parseInt(prevChain || "0") != chainID && changeChain) {
      localStorage.setItem("prevChain", chainID.toString());
      window.location.href = "/";
    }
  }, [chainID, address]); // Removed isOpen from dependency array

  useEffect(() => {
    let storedRoute;
    try {
      storedRoute = localStorage.getItem("route");

      window.location.hash = storedRoute?.toString() || "/";
    } catch {
      window.location.hash = "/";
    }
  }, []);

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
      <StepperForm
        isOpen={isModalOpen}
        onClose={closeModal}
        address={address as string}
      />
    </Container>
  );
}
