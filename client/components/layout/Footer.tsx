import NavbarLogo from "@/components/layout/NavbarLogo";
import Link from "next/link";
export default function Footer() {
  return (
    <footer className="flex w-full  grow items-center justify-center overflow-y-auto rounded-t-lg bg-black/80">
      <div className="mx-auto px-4 py-12 md:px-24 lg:px-8">
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-3">
            <NavbarLogo />
            <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">
              QUADB
            </h1>
            <Link
              className="text-center text-white/90"
              href="https://github.com/nijoe1/QUADB"
            >
              Fork me
            </Link>
          </div>
          <p className="text-center text-lg text-white/90">
            Build with ❤️ for everyone from
            <span className="font-bold">{" Nick🇬🇷"}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
