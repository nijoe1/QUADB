import { Dispatch, SetStateAction, JSX } from "react";
import { RxCrossCircled } from "react-icons/rx";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

import { cn } from "@/lib/utils";

export interface link {
  text: string;
  href: string;
}

function NavLink({ text, href }: link): JSX.Element {
  return (
    <Link
      href={href}
      className="rounded-xl px-3 py-1 text-grey-200 transition-all hover:text-grey-50"
    >
      <span>{text}</span>
    </Link>
  );
}

interface ResponsiveNavLinkProps {
  text: string;
  href: string;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

function ResponsiveNavLink({ text, href, setIsSidebarOpen }: ResponsiveNavLinkProps): JSX.Element {
  return (
    <Link href={href}>
      <div
        className="w-full cursor-pointer py-3 text-center text-grey-200 transition-all hover:bg-black/20"
        onClick={() => setIsSidebarOpen(false)}
      >
        <span className="hover:text-white">{text}</span>
      </div>
    </Link>
  );
}

interface NavLinksResponsiveProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  isConnected: boolean;
}

export function NavLinksResponsive({
  isSidebarOpen,
  setIsSidebarOpen,
  isConnected,
}: NavLinksResponsiveProps): JSX.Element {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-[-400px] z-10 h-screen w-[400px] transform overflow-y-auto bg-white p-6 shadow-lg transition-transform duration-300 ease-in-out dark:bg-grey-900",
        isSidebarOpen && "translate-x-[400px]",
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
      <button className="absolute right-5 top-5" onClick={() => setIsSidebarOpen(false)}>
        <RxCrossCircled className="size-6" />
      </button>
    </div>
  );
}

export default function NavLinks(): JSX.Element {
  return (
    <ul className="hidden grow flex-row items-center justify-center gap-3 font-bold text-grey-600 lg:flex">
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
