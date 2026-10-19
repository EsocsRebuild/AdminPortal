import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Megaphone,
  Image as ImageIcon,
  CheckCircle2,
  Globe,
  LayoutDashboard,
  Church,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserMenu } from "@/components/layout/user-menu";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Crest } from "@/components/icons/logo";
import { getSession } from "@/server/session";

const navItems = [
  {
    href: "/admin-web/dashboard",
    label: "Studio Dashboard",
    icon: LayoutDashboard,
    tooltip: "Overview of your branch content and submission status",
  },
  {
    href: "/admin-web/events",
    label: "Events Studio",
    icon: Calendar,
    tooltip: "Manage and submit public church events",
  },
  {
    href: "/admin-web/programmes",
    label: "Programmes Schedule",
    icon: Megaphone,
    tooltip: "Manage quarterly church programmes and bulletins",
  },
  {
    href: "/admin-web/vetting",
    label: "Super Vetting Queue",
    icon: CheckCircle2,
    tooltip: "1-Click Super Admin content review & approval inbox",
  },
  {
    href: "/admin-web/media",
    label: "Media Gallery",
    icon: ImageIcon,
    tooltip: "Asset library for banners, logos, and photos",
  },
];

export default async function WebAdminLayout({ children }: { children: ReactNode }) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";
  const isAuthPage = pathname.includes("/admin-web/login") || pathname.includes("/admin-web/signup");

  if (isAuthPage) {
    return <>{children}</>;
  }

  const sessionUser = await getSession();
  if (!sessionUser) {
    redirect(`/admin-web/login?next=${encodeURIComponent(pathname || "/admin-web/dashboard")}`);
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100">
        {/* Web Studio Top Navbar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-6">
            <Link href="/admin-web/dashboard" className="group flex items-center gap-3">
              <Crest
                size={38}
                priority
                className="shadow-md ring-2 shadow-amber-950/40 ring-amber-400/80 transition-transform group-hover:scale-105"
              />
              <div>
                <span className="block font-brand text-sm font-extrabold tracking-wide text-white">
                  THE ESOCS WEB STUDIO
                </span>
                <span className="block text-2xs font-semibold tracking-wider text-amber-400 uppercase">
                  Content Administration
                </span>
              </div>
            </Link>

            {/* Studio Navigation Menu */}
            <nav className="ml-4 hidden items-center gap-1.5 md:flex">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                      >
                        <Icon className="size-3.5 text-amber-400" />
                        {item.label}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className="border-slate-700 bg-slate-800 text-slate-200">
                      <p>{item.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard"
                  className="hidden items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400 transition-all hover:bg-amber-500/20 sm:flex"
                >
                  <Church className="size-3.5 text-amber-400" />
                  Main Church Admin
                </Link>
              </TooltipTrigger>
              <TooltipContent className="border-slate-700 bg-slate-800 text-slate-200">
                <p>Switch to Main Ecclesiastical Governance & Member Admin</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/church/mount-zion"
                  target="_blank"
                  className="hidden items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition-all hover:bg-emerald-500/20 sm:flex"
                >
                  <Globe className="size-3.5" />
                  Live Web Preview
                </Link>
              </TooltipTrigger>
              <TooltipContent className="border-slate-700 bg-slate-800 text-slate-200">
                <p>View live public Mount Zion Parish website</p>
              </TooltipContent>
            </Tooltip>

            <ThemeToggle className="text-slate-300 hover:bg-slate-800" />
            <UserMenu />
          </div>
        </header>

        {/* Studio Content Area */}
        <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 md:p-8">{children}</main>
      </div>
    </TooltipProvider>
  );
}
