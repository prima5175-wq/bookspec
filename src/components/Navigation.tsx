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
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex items-center justify-between glass-card !rounded-b-none md:!rounded-b-2xl md:!rounded-t-none px-2 py-1 md:py-2">
          <div className="hidden md:flex items-center gap-2 px-3">
            <span className="text-xl">🪐</span>
            <span className="font-bold text-lg bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              BookSpec
            </span>
          </div>
          <div className="flex items-center justify-around w-full md:w-auto md:gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col md:flex-row items-center gap-0.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl border border-transparent text-sm transition-all ${
                  pathname === item.href
                    ? "nav-active text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-xs md:text-sm">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
