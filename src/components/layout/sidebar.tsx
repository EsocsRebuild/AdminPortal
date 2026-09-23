"use client";

import { LifeBuoy, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Logo } from "@/components/icons/logo";
import { Kbd } from "@/components/ui/kbd";
import { Tooltip } from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import { useHotkey } from "@/hooks/use-hotkey";
import { usePreference } from "@/hooks/use-preference";
import { cn } from "@/lib/utils";

import { SidebarNav } from "./sidebar-nav";

const footerButton = cn(
  "flex h-control-md w-full cursor-pointer items-center gap-2.5 rounded-control px-2.5 text-base font-medium text-sidebar-foreground transition-colors",
  "hover:bg-sidebar-hover hover:text-sidebar-active-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
  "lg:rail:justify-center lg:rail:px-0 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-sidebar-muted",
);

/** Desktop sidebar. Collapses to an icon rail with ⌘B. */
export function Sidebar({ className }: { className?: string }) {
  const [sidebar, setSidebar] = usePreference("sidebar");
  const collapsed = sidebar === "collapsed";
  const toggle = () => setSidebar(collapsed ? "expanded" : "collapsed");
  useHotkey("mod+b", toggle);

  return (
    <aside
      className={cn(
        "sidebar flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        className,
      )}
    >
      <div className="flex h-topbar shrink-0 items-center px-4 lg:rail:justify-center lg:rail:px-0">
        <Logo collapsible />
      </div>

      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-3 scrollbar-none">
        <SidebarNav rail />
      </div>

      <div className="grid shrink-0 gap-0.5 border-t border-sidebar-border p-3">
        <Tooltip content="Help & support" side="right" disabled={!collapsed}>
          <a href={`mailto:${siteConfig.supportEmail}`} className={footerButton}>
            <LifeBuoy />
            <span className="flex-1 truncate lg:rail:sr-only">Help & support</span>
          </a>
        </Tooltip>
        <Tooltip content="Expand sidebar" shortcut="⌘B" side="right" disabled={!collapsed}>
          <button
            type="button"
            onClick={toggle}
            className={footerButton}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            <span className="flex-1 truncate text-left lg:rail:sr-only">Collapse</span>
            <Kbd keys={["⌘", "B"]} className="lg:rail:hidden" />
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
