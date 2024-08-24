import { Dispatch, SetStateAction } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button, Text } from "@chakra-ui/react";
import Link from "next/link";

export type link = {
  text: string;
  href: string;
};

function NavLink({ text, href }: link): JSX.Element {
  return (
    <Link href={href} passHref>
      <Button
        as="a" // Make Button behave like an anchor tag
        className="hover:text-black/90 transition-all rounded-xl px-3 py-1"
        bg="#333333"
        color="white"
      >
        <Text>{text}</Text>
      </Button>
    </Link>
  );
}

type ResponsiveNavLinkProps = {
  text: string;
  href: string;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

function ResponsiveNavLink({
  text,
  href,
  setIsSidebarOpen,
}: ResponsiveNavLinkProps): JSX.Element {
  return (
    <Link href={href} passHref>
      <div
        className="hover:bg-black/20 text-gray transition-all w-full text-center py-3 cursor-pointer"
        onClick={() => setIsSidebarOpen(false)}
      >
        <Text className="hover:text-white text-gray">{text}</Text>
      </div>
    </Link>
  );
}

type NavLinksResponsiveProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  isConnected: boolean;
};

export function NavLinksResponsive({
  isSidebarOpen,
  setIsSidebarOpen,
  isConnected,
}: NavLinksResponsiveProps): JSX.Element {
  return (
    <ul
      className={`fixed z-[10] h-[100vh] top-0 w-[70vw] max-w-[300px] flex flex-col gap-2 justify-center shadow-2xl ${"bg-black/90"} text-white font-bold rounded-box transition-all ${isSidebarOpen ? "left-0 " : "-left-[400px]"}`}
    >
      {isConnected &&
        links.map((item) => (
          <ResponsiveNavLink
            key={item.text}
            text={item.text}
            href={item.href}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        ))}
      <div className="flex md:hidden justify-center gap-2">
        <ConnectButton showBalance={false} chainStatus={"icon"} />
      </div>
      <button
        className="absolute top-5 right-5"
        onClick={() => setIsSidebarOpen(false)}
      >
        <RxCrossCircled className="w-6 h-6" />
      </button>
    </ul>
  );
}

export default function NavLinks(): JSX.Element {
  return (
    <ul className="hidden lg:flex flex-row justify-center items-center gap-3 grow font-bold text-primary">
      {links.map((item) => (
        <NavLink key={item.text} text={item.text} href={item.href} />
      ))}
    </ul>
  );
}

const links: link[] = [
  {
    text: "Home",
    href: "/",
  },
  {
    text: "Explore",
    href: "/spaces",
  },
  {
    text: "Profile",
    href: "/profile",
  },
  {
    text: "Fund",
    href: "/fundWhatMatters",
  },
];
