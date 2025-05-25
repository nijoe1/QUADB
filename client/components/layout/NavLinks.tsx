import { Dispatch, SetStateAction } from "react";
import { RxCrossCircled } from "react-icons/rx";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button, Text } from "@chakra-ui/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type link = {
  text: string;
  href: string;
};

function NavLink({ text, href }: link): JSX.Element {
  return (
    <Link
      href={href}
      passHref
      className=" rounded-xl px-3 py-1 text-gray-200 transition-all hover:text-gray-50 "
    >
      <Text>{text}</Text>
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
        className="text-gray w-full cursor-pointer py-3 text-center transition-all hover:bg-black/20"
        onClick={() => setIsSidebarOpen(false)}
      >
        <Text className="text-gray hover:text-white">{text}</Text>
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
    <div
      className={cn(
        "fixed inset-y-0 left-[-400px] z-10 h-screen w-[400px] transform overflow-y-auto bg-white p-6 shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-900",
        isSidebarOpen && "translate-x-[400px]"
      )}
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
      <div className="flex justify-center gap-2 md:hidden">
        <ConnectButton showBalance={false} chainStatus={"icon"} />
      </div>
      <button
        className="absolute right-5 top-5"
        onClick={() => setIsSidebarOpen(false)}
      >
        <RxCrossCircled className="size-6" />
      </button>
    </div>
  );
}

export default function NavLinks(): JSX.Element {
  return (
    <ul className="text-primary hidden grow flex-row items-center justify-center gap-3 font-bold lg:flex">
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
    text: "Data Quests",
    href: "/quests",
  },
  // {
  //   text: "Profile",
  //   href: "/profile",
  // },
  // {
  //   text: "Fund",
  //   href: "/fundWhatMatters",
  // },
];
