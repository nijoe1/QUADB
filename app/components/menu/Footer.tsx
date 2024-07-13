import NavbarLogo from "@/components/menu/NavbarLogo";
import Link from "next/link";
export default function Footer() {
  return (
    <footer className="relative  bg-black/80 bottom-0 rounded-t-lg">
      <div className="px-4 py-12 mx-auto md:px-24 lg:px-8">
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-3">
            <NavbarLogo />
            <h1 className="uppercase font-bold text-3xl text-white tracking-tighter">
              QUADB
            </h1>
            <Link
              className="text-center text-white/90"
              href="https://github.com/nijoe1/QUADB"
            >
              Fork me
            </Link>
          </div>
          <p className="text-lg text-center text-white/90">
            Build with ❤️ for ETHGlobal Brussels from
            <span className="font-bold">{" Nick🇬🇷"}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
