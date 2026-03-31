"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "홈", icon: "🚀" },
  { href: "/write", label: "독서록", icon: "📝" },
  { href: "/reading", label: "읽기", icon: "📖" },
  { href: "/penpal", label: "펜팔", icon: "📡" },
  { href: "/profile", label: "프로필", icon: "🦸" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-auto">
      <div className="mx-auto max-w-4xl px-2">
        <div className="flex items-center justify-between glass-card !rounded-b-none md:!rounded-b-2xl md:!rounded-t-none px-1 py-1 md:py-2">
          <div className="hidden md:flex items-center gap-2 px-3">
            <div className="open-book ob-sm">
              <div className="ob-left" />
              <div className="ob-right" />
              <div className="ob-light" />
            </div>
            <span className="logo-3d text-xl">BookSpec</span>
            <div className="logo-star-field" style={{ transform: "scale(0.55)" }}>
              <div className="ls ls-1" />
              <div className="ls ls-2" />
              <div className="ls ls-3" />
            </div>
          </div>
          <div className="flex items-center justify-around w-full md:w-auto md:gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center px-3 py-1.5 rounded-xl border border-transparent transition-all ${
                  pathname === item.href
                    ? "nav-active text-white"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="text-3xl leading-none">{item.icon}</span>
                <span className="text-[10px] font-medium leading-tight mt-0.5">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
