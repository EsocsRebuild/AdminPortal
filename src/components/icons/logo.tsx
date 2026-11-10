import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** The official crest of the Eternal Sacred Order of the Cherubim & Seraphim. */
export function Crest({
  size = 40,
  className,
  priority = true,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/esocs-crest.png"
      alt="ESOCS Official Crest"
      width={size}
      height={size}
      priority={priority}
      loading="eager"
      className={cn(
        "shrink-0 rounded-full object-contain ring-2 ring-amber-400/70 drop-shadow-md",
        className,
      )}
    />
  );
}

/** Legacy / icon mark wrapper returning the official Crest */
export function LogoMark({ className, size = 36 }: { className?: string; size?: number }) {
  return <Crest size={size} className={className} />;
}

/** Official Crest and stacked brand wordmark */
export function Logo({
  className,
  collapsible = false,
  href = "/dashboard",
  size = "md",
}: {
  className?: string;
  collapsible?: boolean;
  href?: string;
  size?: "sm" | "md" | "lg";
}) {
  const crestSize = size === "lg" ? 52 : size === "sm" ? 32 : 40;
  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} Home`}
      className={cn(
        "flex min-w-0 items-center gap-3 rounded-md transition-opacity hover:opacity-95",
        className,
      )}
    >
      <Crest size={crestSize} priority className="shadow-md ring-2 shadow-amber-950/30 ring-amber-400/80" />
      <span className={cn("grid min-w-0 leading-tight", collapsible && "lg:rail:hidden")}>
        <span
          className={cn(
            "font-brand font-bold tracking-tight text-foreground",
            size === "lg" ? "text-xl" : size === "sm" ? "text-base" : "text-lg",
          )}
        >
          THE ESOCS
        </span>
        <span className="text-2xs font-semibold tracking-wider text-amber-700 uppercase dark:text-amber-400">
          Administration Portal
        </span>
      </span>
    </Link>
  );
}
