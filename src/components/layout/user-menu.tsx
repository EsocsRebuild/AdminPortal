"use client";

import { Check, Church, Globe, LogOut, Monitor, Moon, Palette, ShieldCheck, Sun, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

import { useSession } from "@/components/auth/session-provider";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/features/auth/actions";
import { useMounted } from "@/hooks/use-mounted";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function UserMenu() {
  const user = useSession();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  if (!user) return null;

  const isWebAdmin = pathname?.startsWith("/admin-web");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex cursor-pointer items-center gap-2 rounded-full p-0.5 transition-shadow hover:ring-4 hover:ring-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-label="Account menu"
      >
        <Avatar name={user.name} src={user.avatarUrl} size="md" status="online" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-3 py-2 font-normal">
          <Avatar name={user.name} src={user.avatarUrl} size="lg" />
          <span className="grid min-w-0">
            <span className="truncate text-base font-semibold text-foreground">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            <span className="mt-1 text-2xs font-medium text-primary">{user.role.name}</span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/settings/profile">
              <UserRound /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings/security">
              <ShieldCheck /> Security
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Palette /> Appearance
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {themes.map((t) => (
                <DropdownMenuItem key={t.value} onSelect={() => setTheme(t.value)}>
                  <t.icon /> {t.label}
                  {mounted && theme === t.value && <Check className="ml-auto text-primary!" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {isWebAdmin ? (
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="font-semibold text-amber-500 focus:text-amber-600">
                <Church className="size-4 text-amber-500" /> Switch to Main Admin
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild>
              <Link href="/admin-web/dashboard" className="font-semibold text-emerald-500 focus:text-emerald-600">
                <Globe className="size-4 text-emerald-500" /> Switch to Web Studio
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem tone="danger" onSelect={() => void signOut("manual")}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
